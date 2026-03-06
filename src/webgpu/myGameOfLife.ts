const GRID_SIZE: number = 4;

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

    const grid = new Float32Array([GRID_SIZE, GRID_SIZE]);

    const uniformBuffer = device.createBuffer({
        label: "Cell grid uniform buffer",
        size: grid.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    device.queue.writeBuffer(uniformBuffer, 0, grid);

    const shaderModule = device.createShaderModule({
        label: 'shader',
        code: /* wgsl */ `
            @group(0) @binding(0) var <uniform> grid: vec2f;

            @vertex 
            fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
                let cell = vec2f(1, 1);
                let cellOffset = cell / grid * 2;
                let gridPos = ((pos + 1) / grid) - 1 + cellOffset;
                return vec4f(gridPos, 0, 1);
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
    });

    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: uniformBuffer
        }]
    });

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
    pass.setBindGroup(0, bindGroup);
    pass.draw(6);

    pass.end();

    const commandBuffer = commandEncoder.finish();

    device.queue.submit([commandBuffer]);
}