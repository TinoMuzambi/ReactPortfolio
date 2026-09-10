import { cvPayload } from "@/lib/public-data";

export const dynamic = "force-static";

export function GET() {
	return Response.json(cvPayload, {
		headers: {
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
			"Content-Language": "en-ZA",
		},
	});
}
