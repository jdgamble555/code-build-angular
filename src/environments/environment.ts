// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  supabase_url: process.env["SUPABASE_URL"] as string,
  supabase_key: process.env["SUPABASE_KEY"] as string,
  title: 'Code.Build',
  domain: 'code.build',
  description: 'A blog about Databases, Searching, Indexing, Programming, Security, Hosting, and Other Website Technologies!',
  short_desc: 'An easier way to code your web applications !',
  site: "http://localhost:4200",
  storage: 'code-build',
  author: 'Jonathan Gamble',
  icon: 'code',
  icon_class: 'ng-light-blue',
  icon_dark_class: 'ng-blue',
  dark_back: 'ng-black-back',
  light_back: 'ng-blue-gray-back'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
