struct CoolMaterial {
    color: vec4<f32>,
};

@group(1) @binding(0)
var<uniform> material: CoolMaterial;
@group(1) @binding(1)
var color_texture: texture_2d<f32>;
@group(1) @binding(2)
var color_sampler: sampler;

@fragment
fn fragment(
    #import bevy_pbr::mesh_vertex_output
) -> @location(0) vec4<f32> {
    return material.color * textureSample(color_texture, color_sampler, uv);
}

// From https://bevyengine.org/news/bevy-0-8/