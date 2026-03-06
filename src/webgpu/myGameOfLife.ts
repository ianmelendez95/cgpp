

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
    
    const vertices = new Float32Array([
        -0.8, -0.8,
         0.8, -0.8,
         0.8,  0.8,

        -0.8, -0.8,
         0.8,  0.8,
        -0.8,  0.8
    ])

    const vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    const vertexBufferDesc: GPUVertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
            format: 'float32x2',
            offset: 0,
            shaderLocation: 0
        }]
    };

    const shaderModule = device.createShaderModule({
        label: 'shader',
        code: /* wgsl */ `
            @vertex 
            fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
                return vec4f(pos, 0, 1);
            }

            @fragment
            fn fragmentMain() -> @location(0) vec4f {
                return vec4f(1, 0, 0, 1);
            }
        `
    })

    const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: {
            module: shaderModule,
            entryPoint: 'vertexMain',
            buffers: [vertexBufferDesc]
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fragmentMain',
            targets: [{
                format: navigator.gpu.getPreferredCanvasFormat()
            }]
        }
    })

    const pass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store",
            clearValue: [0, 0, 0.4, 1]
        }]
    });

    pass.setVertexBuffer(0, vertexBuffer);
    pass.setPipeline(pipeline);
    pass.draw(6);

    pass.end();

    const commandBuffer = commandEncoder.finish();

    device.queue.submit([commandBuffer]);
}