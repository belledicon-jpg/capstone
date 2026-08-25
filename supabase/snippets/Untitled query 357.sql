create table public.otps (
  email text primary key,
  code text not null,
  expires_at bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);