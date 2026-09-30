import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Get basic stats (Brightness and Contrast)
        const stats = await sharp(buffer).stats();
        
        let totalMean = 0;
        let totalStdev = 0;
        const channels = stats.channels.filter(c => c.mean > 0);
        
        channels.forEach(ch => {
            totalMean += ch.mean;
            totalStdev += ch.stdev;
        });

        const avgBrightness = totalMean / channels.length;
        const avgContrast = totalStdev / channels.length;

        // 2. Calculate Blur using Laplacian Edge Detection Kernel
        // The Laplacian kernel highlights regions of rapid intensity change (edges).
        // A blurry image will have fewer/softer edges, resulting in a lower stdev after convolution.
        const laplacianKernel = {
            width: 3,
            height: 3,
            kernel: [
                0, 1, 0,
                1, -4, 1,
                0, 1, 0
            ]
        };

        const edgeBuffer = await sharp(buffer)
            .greyscale()
            .convolve(laplacianKernel)
            .toBuffer();

        const edgeStats = await sharp(edgeBuffer).stats();
        const blurScore = edgeStats.channels[0].stdev;

        // Interpret scores
        const isBlurry = blurScore < 10; // Adjust threshold based on testing
        const isTooDark = avgBrightness < 40;
        const isTooBright = avgBrightness > 220;
        const hasLowContrast = avgContrast < 20;

        return NextResponse.json({
            success: true,
            analysis: {
                blurScore,
                brightness: avgBrightness,
                contrast: avgContrast,
                isBlurry,
                isTooDark,
                isTooBright,
                hasLowContrast,
            }
        });
    } catch (error: unknown) {
        console.error("Image analysis error:", error);
        return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
    }
}
