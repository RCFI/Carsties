using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;

namespace Contracts.Extensions;

public static class Telemetry
{
    public class UseTelemetryStartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
        {
            return builder =>
            {
                builder.UseOpenTelemetryPrometheusScrapingEndpoint();
                next(builder);
            };
        }
    }

    public static WebApplicationBuilder UseTelemetry(this WebApplicationBuilder builder)
    {
        builder.Services.AddOpenTelemetry().ConfigureResource(r =>
        {
            var assemblyName = Assembly.GetEntryAssembly()?.GetName().Name ?? "Unknown";
            r.AddService(assemblyName);
        }).WithMetrics(metricsBuilder =>
        {
            metricsBuilder.AddHttpClientInstrumentation()
                .AddAspNetCoreInstrumentation()
                .AddRuntimeInstrumentation()
                .AddProcessInstrumentation()
                .AddPrometheusExporter();
        });
        builder.Services.AddTransient<IStartupFilter, UseTelemetryStartupFilter>();
        return builder;
    }
}