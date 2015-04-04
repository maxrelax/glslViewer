#ifdef GL_ES
precision mediump float;
#endif


#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

//  Default uniforms
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

//  Automatically send uniforms to the argument call. Ex.:
//
//  $ piFrag test.frag -u_tex0 test.png
//
//  or the name set automatically by:
//
//  $ piFrag test.frag test.png
//
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

// some sample easing functions

float sineIn(float t) {
  return sin((t - 1.0) * HALF_PI) + 1.0;
}

float sineOut(float t) {
  return sin(t * HALF_PI);
}

float sineInOut(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

float qinticIn(float t) {
  return pow(t, 5.0);
}

float qinticOut(float t) {
  return 1.0 - (pow(t - 1.0, 5.0));
}

//  Simple function that draws a rectangular shape
float rect (vec2 _position, vec2 _size) {
  _size = vec2(0.5)-_size*0.5;
  vec2 uv = smoothstep(_size,_size+vec2(0.0001),_position);
  uv *= smoothstep(_size,_size+vec2(0.0001),vec2(1.0)-_position);
  return uv.x*uv.y;
}

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    float y = pow(st.x,5.0);

    vec3 color = vec3(y);

    // 1. Set the color to effect
    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,1.0);

    // 2.  Load image and fix their aspect ratio
    //  Adjust aspect ratio
    float aspect = u_resolution.x/u_resolution.y;
    float imgAspect = u_tex0Resolution.x/u_tex0Resolution.y;
    vec4 img = texture2D(u_tex0,st*vec2(1.,imgAspect)+vec2(0.0,-0.1));

    if ( u_tex0Resolution != vec2(0.0) ){
        color = mix(color,img.rgb,img.a);
    }

    //  3. Add a mouse cursor
    vec2 mousePos = st-vec2(u_mouse.x*aspect,u_mouse.y)/u_resolution+vec2(0.5);
    color += vec3( rect(mousePos, vec2(0.03,0.005)) + rect(mousePos, vec2(0.005,0.03)) );

    gl_FragColor = vec4(color,1.0);
}
