using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.PlatformAbstractions;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SpaServices.Prerendering;

namespace Ballotbox.Helpers
{
    [HtmlTargetElement(Attributes = PrerenderModuleAttributeName)]
    public class StorePrerenderTagHelper : PrerenderTagHelper
    {
        const string PrerenderModuleAttributeName = "asp-prerender-module";
        const string PrerenderHydrateDataAttributeName = "asp-prerender-hydrate-with";

        [HtmlAttributeName(PrerenderHydrateDataAttributeName)]
        public object HydrateData { get; set; }

        protected string applicationBasePath;
        protected INodeServices nodeServices;

        public StorePrerenderTagHelper(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            var hostEnv = (IHostingEnvironment)serviceProvider.GetService(typeof(IHostingEnvironment));
            this.nodeServices = (INodeServices)serviceProvider.GetService(typeof(INodeServices));
            this.applicationBasePath = hostEnv.ContentRootPath;
        }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            var request = ViewContext.HttpContext.Request;
            var result = await HydratedPrerenderer.RenderToString(
                this.applicationBasePath,
                this.nodeServices,
                new JavaScriptModuleExport(ModuleName)
                {
                    ExportName = ExportName,
                    WebpackConfig = WebpackConfigPath
                },
                request.GetEncodedUrl(),
                request.Path + request.QueryString.Value,
                HydrateData);
            output.Content.SetHtmlContent(result.Html);

            // Also attach any specified globals to the 'window' object. This is useful for transferring
            // general state between server and client.
            if (result.Globals != null)
            {
                var stringBuilder = new StringBuilder();
                foreach (var property in result.Globals.Properties())
                {
                    stringBuilder.AppendFormat("window.{0} = {1};",
                        property.Name,
                        property.Value.ToString(Formatting.None));
                }
                if (stringBuilder.Length > 0)
                {
                    output.PostElement.SetHtmlContent($"<script>{ stringBuilder.ToString() }</script>");
                }
            }
        }
    }
}
