import { projectsPayload } from "@/lib/public-data";

export const dynamic = "force-static";

export function GET() {
	return Response.json(projectsPayload, {
		headers: {
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
			"Content-Language": "en-ZA",
		},
	});
}
