import * as React from 'react';
import {Link} from 'react-router';

declare var process:any;
if (process.env['BROWSER']) {
  require('stylesheets/components/_Footer');
}


export default (): React.ReactElement<any> => {
  return (
    <footer className="container footer">
      <p className="pull-right"><Link to="/">Back Home</Link></p>

      <p>Built as a sample application with <a href=
      "http://docs.asp.net/en/latest/conceptual-overview/dotnetcore.html">.NET Core</a>, <a href=
      "https://www.typescriptlang.org/">TypeScript</a>, <a href=
      "https://facebook.github.io/react/">React</a>, <a href=
      "http://redux.js.org/">Redux</a>, and <a href=
      "http://postgres.org/">PostgreSQL</a> by <a href="https://www.github.com/dmayala"
      target="_blank">@dmayala</a>.<br />
      The source code for this application is available in <a href="https://github.com/dmayala/ballotboxcore" target="_blank">this
      repository</a> on GitHub.</p>
    </footer>
  );
}