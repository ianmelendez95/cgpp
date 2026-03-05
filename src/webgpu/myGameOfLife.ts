

export default async function myGameOfLife() {
    const canvas = document.getElementById('cgpp-canvas')! as HTMLCanvasElement;

    const adapter = (await navigator.gpu.requestAdapter())!;

    const device = await adapter.requestDevice();

    const context = canvas.getContext("webgpu")!;
    context.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat()
    });

    const commandEncoder = device.createCommandEncoder();
    
    const pass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store"
        }]
    });
    pass.end();

    const commandBuffer = commandEncoder.finish();

    device.queue.submit([commandBuffer]);
}