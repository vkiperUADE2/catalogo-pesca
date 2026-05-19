-- Keep the database limit aligned with the admin panel image slots.
-- Products and excursions can have slots 0 through 9, for 10 images total.

do $$
declare
  trigger_record record;
begin
  for trigger_record in
    select
      trigger_class.relname as trigger_table,
      trigger_info.tgname as trigger_name
    from pg_trigger trigger_info
    join pg_class trigger_class on trigger_class.oid = trigger_info.tgrelid
    join pg_namespace trigger_namespace on trigger_namespace.oid = trigger_class.relnamespace
    join pg_proc trigger_function on trigger_function.oid = trigger_info.tgfoid
    where not trigger_info.tgisinternal
      and trigger_namespace.nspname = 'public'
      and trigger_class.relname in ('product_images', 'excursion_images')
      and lower(pg_get_functiondef(trigger_function.oid)) like '%im%gen%'
      and lower(pg_get_functiondef(trigger_function.oid)) like '%5%'
  loop
    execute format(
      'drop trigger if exists %I on public.%I',
      trigger_record.trigger_name,
      trigger_record.trigger_table
    );
  end loop;
end $$;

do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select
      table_class.relname as table_name,
      constraint_info.conname as constraint_name
    from pg_constraint constraint_info
    join pg_class table_class on table_class.oid = constraint_info.conrelid
    join pg_namespace table_namespace on table_namespace.oid = table_class.relnamespace
    where table_namespace.nspname = 'public'
      and table_class.relname in ('product_images', 'excursion_images')
      and constraint_info.contype = 'c'
      and lower(pg_get_constraintdef(constraint_info.oid)) like '%sort_order%'
      and (
        pg_get_constraintdef(constraint_info.oid) like '%< 5%'
        or pg_get_constraintdef(constraint_info.oid) like '%<= 4%'
        or pg_get_constraintdef(constraint_info.oid) like '%between 0 and 4%'
      )
  loop
    execute format(
      'alter table public.%I drop constraint if exists %I',
      constraint_record.table_name,
      constraint_record.constraint_name
    );
  end loop;
end $$;

create or replace function public.validar_maximo_imagenes_producto()
returns trigger
language plpgsql
as $$
declare
  cantidad_imagenes integer;
begin
  if new.sort_order < 0 or new.sort_order > 9 then
    raise exception 'El orden de la imagen debe estar entre 0 y 9.';
  end if;

  select count(*)
    into cantidad_imagenes
    from public.product_images
    where product_id = new.product_id
      and (tg_op = 'INSERT' or id <> new.id);

  if cantidad_imagenes >= 10 then
    raise exception 'Un producto puede tener como maximo 10 imagenes.';
  end if;

  return new;
end;
$$;

create or replace function public.validar_maximo_imagenes_excursion()
returns trigger
language plpgsql
as $$
declare
  cantidad_imagenes integer;
begin
  if new.sort_order < 0 or new.sort_order > 9 then
    raise exception 'El orden de la imagen debe estar entre 0 y 9.';
  end if;

  select count(*)
    into cantidad_imagenes
    from public.excursion_images
    where excursion_id = new.excursion_id
      and (tg_op = 'INSERT' or id <> new.id);

  if cantidad_imagenes >= 10 then
    raise exception 'Una excursion puede tener como maximo 10 imagenes.';
  end if;

  return new;
end;
$$;

drop trigger if exists validar_maximo_imagenes_producto_trigger on public.product_images;
create trigger validar_maximo_imagenes_producto_trigger
before insert or update of product_id, sort_order on public.product_images
for each row
execute function public.validar_maximo_imagenes_producto();

drop trigger if exists validar_maximo_imagenes_excursion_trigger on public.excursion_images;
create trigger validar_maximo_imagenes_excursion_trigger
before insert or update of excursion_id, sort_order on public.excursion_images
for each row
execute function public.validar_maximo_imagenes_excursion();

alter table public.product_images
  drop constraint if exists product_images_sort_order_0_to_9;

alter table public.product_images
  add constraint product_images_sort_order_0_to_9
  check (sort_order between 0 and 9);

alter table public.excursion_images
  drop constraint if exists excursion_images_sort_order_0_to_9;

alter table public.excursion_images
  add constraint excursion_images_sort_order_0_to_9
  check (sort_order between 0 and 9);
