
export default async function gameOfLife() {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error("No canvas!");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("No appropriate GPUAdapter found.");
    }

    const device = await adapter.requestDevice();

    const context = canvas.getContext("webgpu");
    if (!context) throw new Error("No context");

    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context?.configure({
        device,
        format: canvasFormat
    });

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store"
        }]
    });
    pass.end();

    device.queue.submit([encoder.finish()]);
}