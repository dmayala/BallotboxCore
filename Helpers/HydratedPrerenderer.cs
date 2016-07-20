using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.NodeServices;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using System.IO;
using System.Reflection;

namespace Ballotbox.Helpers
{
    public static class HydratedPrerenderer
    {
        private static Lazy<StringAsTempFile> NodeScript;

        static HydratedPrerenderer()
        {
            NodeScript = new Lazy<StringAsTempFile>(() => {
                var script = ScriptReader.Read("./ClientApp/utils/prerenderer.js");
                return new StringAsTempFile(script); // Will be cleaned up on process exit
            });
        }

        public static Task<RenderToStringResult> RenderToString(
            string applicationBasePath,
            INodeServices nodeServices,
            JavaScriptModuleExport bootModule,
            string requestAbsoluteUrl,
            string requestPathAndQuery,
            object customDataParameter)
        {
            return nodeServices.InvokeExportAsync<RenderToStringResult>(
                NodeScript.Value.FileName,
                "renderToString",
                applicationBasePath,
                bootModule,
                requestAbsoluteUrl,
                requestPathAndQuery,
                customDataParameter);
        }
    }

    public static class ScriptReader
    {
        public static string Read(string path)
        {
            using (var stream = File.OpenRead(path))
            using (var sr = new StreamReader(stream))
            {
                return sr.ReadToEnd();
            }
        }
    }
}
