export interface Env {
  ALLOWED_ORIGIN?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string; // Secret
  RESEND_API_KEY?: string; // Secret
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  organization?: string;
  projectType: string;
  message: string;
  consent: boolean;
  turnstileToken: string;
  website?: string; // Honeypot
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    // Standard CORS headers helper
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin && (allowedOrigin === "*" || allowedOrigin === origin) ? origin : allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // Handle OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, code: "METHOD_NOT_ALLOWED" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      // Parse payload
      const body = (await request.json()) as ContactPayload;

      // 1. Honeypot check (website field should be empty)
      if (body.website) {
        return new Response(JSON.stringify({ ok: false, code: "BOT_REJECTED" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // 2. Input validation
      if (!body.name || !body.email || !body.projectType || !body.message || !body.consent || !body.turnstileToken) {
        return new Response(JSON.stringify({ ok: false, code: "INVALID_INPUT" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // 3. Verify Turnstile token
      const turnstileSecret = env.TURNSTILE_SECRET;
      if (turnstileSecret) {
        const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: body.turnstileToken,
          }),
        });

        const turnstileData = (await turnstileRes.json()) as { success: boolean };
        if (!turnstileData.success) {
          return new Response(JSON.stringify({ ok: false, code: "BOT_REJECTED" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
      }

      // 4. Send Email via Resend REST API
      const resendApiKey = env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.error("Missing RESEND_API_KEY binding");
        return new Response(JSON.stringify({ ok: false, code: "SERVER_ERROR" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const toEmail = env.CONTACT_TO || "hola@jeshuasalazar.com";
      const fromEmail = env.CONTACT_FROM || "hola@jeshuasalazar.com";

      const emailSubject = `Nuevo Lead: [${body.projectType.toUpperCase()}] - ${body.name}`;
      const emailHtml = `
        <h2>Nuevo contacto desde jeshuasalazar.com</h2>
        <p><strong>Nombre:</strong> ${body.name}</p>
        <p><strong>Correo:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
        <p><strong>Organización:</strong> ${body.organization || "N/A"}</p>
        <p><strong>Tipo de Proyecto:</strong> ${body.projectType}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap; background-color: #f4f4f5; padding: 12px; border-radius: 8px; border: 1px solid #e4e4e7;">${body.message}</p>
        <hr />
        <p style="font-size: 11px; color: #71717a;">Este correo fue enviado de forma automática a través del Cloudflare Worker configurado en jeshuasalazar.com.</p>
      `;

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `Jeshua Salazar <${fromEmail}>`,
          to: [toEmail],
          subject: emailSubject,
          html: emailHtml,
          reply_to: body.email,
        }),
      });

      const resendData = (await resendResponse.json()) as { id?: string; message?: string };

      if (!resendResponse.ok) {
        console.error("Resend API error:", resendData);
        return new Response(JSON.stringify({ ok: false, code: "DELIVERY_FAILED" }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ ok: true, requestId: resendData.id }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (error: any) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ ok: false, code: "SERVER_ERROR" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};
