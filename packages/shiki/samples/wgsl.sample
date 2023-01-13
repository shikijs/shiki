struct ViewUniform {
    transform: mat4x4<f32>;
    size: vec2<f32>;
};

@group(0) @binding(0)
var<uniform> view_uniform: ViewUniform;

struct Vertex {
    @location(0) position: vec2<f32>;
};

struct QuadInstance{
    @location(1) position: vec2<f32>;
    @location(2) size: vec2<f32>;
    @location(3) color: vec4<f32>;
    @location(4) border_radius: vec4<f32>;
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>;
    @location(0) src_position: vec2<f32>;

    @location(1) quad_size: vec2<f32>;
    @location(2) quad_color: vec4<f32>;
    @location(3) quad_border_radius: vec4<f32>;
};

@stage(vertex)
fn vs_main(vertex: Vertex, quad: QuadInstance) -> VertexOutput {
    var i_transform: mat4x4<f32> = mat4x4<f32>(
        vec4<f32>(quad.size.x, 0.0, 0.0, 0.0),
        vec4<f32>(0.0, quad.size.y, 0.0, 0.0),
        vec4<f32>(0.0, 0.0, 1.0, 0.0),
        vec4<f32>(quad.position, 0.0, 1.0)
    );

    var out: VertexOutput;
    out.position = view_uniform.transform * i_transform * vec4<f32>(vertex.position, 0.0, 1.0);
    out.src_position = vertex.position;

    out.quad_color = quad.color;
    out.quad_size = quad.size;
    out.quad_border_radius = quad.border_radius;

    return out;
}

fn corrner_alpha(radius: f32, pos: vec2<f32>, cords: vec2<f32>) -> f32{
    let lower = radius - 0.7;
    let upper = radius + 0.7;
    return 1.0 - smoothStep(lower, upper, length(pos - cords));
}

fn fragment_alpha(
    position: vec2<f32>,
    size: vec2<f32>,
    radius: vec4<f32>,
) -> f32 {
    let pos = position * size;
    // Top Left
    let tl = vec2<f32>(radius.x, radius.x);
    // Top Right
    let tr = vec2<f32>(size.x - radius.y, radius.y);
    // Bottom Left
    let bl = vec2<f32>(radius.z, size.y - radius.z);
    // Bottom Right
    let br = vec2<f32>(size.x - radius.w, size.y - radius.w);

    if (pos.x < tl.x && pos.y < tl.y) {
        return corrner_alpha(radius.x, pos, tl);
    } elseif (pos.x > tr.x && pos.y < tr.y){
        return corrner_alpha(radius.y, pos, tr);
    } elseif (pos.x < bl.x && pos.y > bl.y){
        return corrner_alpha(radius.z, pos, bl);
    } elseif (pos.x > br.x && pos.y > br.y){
        return corrner_alpha(radius.w, pos, br);
    } else {
        return 1.0;
    }
}


@stage(fragment)
fn fs_main(in: VertexOutput) ->  @location(0) vec4<f32> {
    let alpha: f32 = fragment_alpha(
        in.src_position.xy,
        in.quad_size,
        in.quad_border_radius
    );

    return vec4<f32>(in.quad_color.xyz, in.quad_color.w * alpha);
}