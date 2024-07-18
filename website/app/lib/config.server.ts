import { z } from 'zod'

export const {
    SESSION_SECRET,
    APPLICATIONINSIGHTS_CONNECTION_STRING,
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT,
    OTEL_EXPORTER_OTLP_ENDPOINT,
    HONEYCOMB_API_KEY,
} = z
    .object({
        NODE_ENV: z.string().default('development'),
        SESSION_SECRET: z.string().default('SESSION_SECRET'),

        APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
        OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
        OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.string().optional(),
        OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: z.string().optional(),
        OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: z.string().optional(),
        HONEYCOMB_API_KEY: z.string().optional(),
    })
    .parse(process.env)
