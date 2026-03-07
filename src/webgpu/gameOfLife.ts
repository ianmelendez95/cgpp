
const GRID_SIZE = 4;

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

    const vertices = new Float32Array([
        -0.8, -0.8,
         0.8, -0.8,
         0.8,  0.8,

        -0.8, -0.8,
         0.8,  0.8,
        -0.8,  0.8
    ]);

    const vertexBuffer = device.createBuffer({
        label: "Cell vertices",
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

    const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8,
        attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0
        }]
    }

    const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
    const uniformBuffer = device.createBuffer({
        label: "Grid uniforms",
        size: uniformArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

    const cellShaderModule = device.createShaderModule({
        label: "Cell shader",
        code: /* wgsl */`
            @group(0) @binding(0) var <uniform> grid: vec2f;

            @vertex 
            fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
                let cell = vec2f(1, 1);
                let cellAt00 = (pos + 1) / grid - 1;
                let cellOffset = cell * (2 / grid);
                let gridPos = cellAt00 + cellOffset;
                return vec4f(gridPos, 0, 1); // (x, y, z, w)
            }

            @fragment 
            fn fragmentMain() -> @location(0) vec4f {
                return vec4f(1, 0, 0, 1);
            }
        `
    });

    const cellPipeline = device.createRenderPipeline({
        label: "Cell pipeline",
        layout: "auto",
        vertex: {
            module: cellShaderModule,
            entryPoint: "vertexMain",
            buffers: [vertexBufferLayout]
        },
        fragment: {
            module: cellShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
                format: canvasFormat
            }]
        }
    });

    const bindGroup = device.createBindGroup({
        label: "Cell renderer bind group",
        layout: cellPipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {buffer: uniformBuffer}
        }]
    });

    const encoder = device.createCommandEncoder();

    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: "clear",
            storeOp: "store",
            clearValue: {r: 0, g: 0, b: 0.4, a: 1}
        }]
    });

    pass.setPipeline(cellPipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(vertices.length / 2);

    pass.end();

    device.queue.submit([encoder.finish()]);
}