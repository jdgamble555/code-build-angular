export const environment = {
  production: false,
  supabase_url: process.env["SUPABASE_URL"] as string,
  supabase_key: process.env["SUPABASE_KEY"] as string,
  title: 'Code.Build',
  domain: 'code.build',
  description: 'A blog about Databases, Searching, Indexing, Programming, Security, Hosting, and Other Website Technologies!',
  short_desc: 'Building code, simplified.',
  site: "https://code.build",
  storage: 'code-build',
  author: 'Jonathan Gamble'
};
