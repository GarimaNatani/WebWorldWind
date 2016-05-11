/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SkyProgram
 */
define([
        '../shaders/AtmosphereProgram'
    ],
    function (AtmosphereProgram) {
        "use strict";

        var  SkyProgram = function (gl) {

            var vertexShaderSource =
                    'precision mediump float;\n' +
                    'precision mediump int;\n' +

                    'const int SAMPLE_COUNT = 2;\n' +
                    'const float SAMPLES = 2.0;\n' +

                    'const float PI = 3.141592653589;\n' +
                    'const float Kr = 0.0025;\n' +
                    'const float Kr4PI = Kr * 4.0 * PI;\n' +
                    'const float Km = 0.0015;\n' +
                    'const float Km4PI = Km * 4.0 * PI;\n' +
                    'const float ESun = 15.0;\n' +
                    'const float KmESun = Km * ESun;\n' +
                    'const float KrESun = Kr * ESun;\n' +
                    'const vec3 invWavelength = vec3(5.60204474633241, 9.473284437923038, 19.643802610477206);\n' +
                    'const float rayleighScaleDepth = 0.25;\n' +

                    'uniform mat4 mvpMatrix;\n' +
                    'uniform vec3 vertexOrigin;\n' +
                    'uniform vec3 eyePoint;\n' +
                    'uniform float eyeMagnitude;\n' +        /* The eye point's magnitude */
                    'uniform float eyeMagnitude2;\n' +       /* eyeMagnitude^2 */
                    'uniform vec3 lightDirection;\n' +       /* The direction vector to the light source */
                    'uniform float atmosphereRadius;\n' +    /* The outer (atmosphere) radius */
                    'uniform float atmosphereRadius2;\n' +   /* atmosphereRadius^2 */
                    'uniform float globeRadius;\n' +         /* The inner (planetary) radius */
                    'uniform float scale;\n' +               /* 1 / (atmosphereRadius - globeRadius) */
                    'uniform float scaleDepth;\n' +          /* The scale depth (i.e. the altitude at which the
                     atmosphere's average density is found) */
                    'uniform float scaleOverScaleDepth;\n' + /* fScale / fScaleDepth */

                    'attribute vec4 vertexPoint;\n' +

                    'varying vec3 primaryColor;\n' +
                    'varying vec3 secondaryColor;\n' +
                    'varying vec3 direction;\n' +
                    'varying vec2 texCoord;\n' +

                    'float scaleFunc(float cos)\n' +
                    '{\n' +
                    '    float x = 1.0 - cos;\n' +
                    '    return scaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n' +
                    '}\n' +

                    'void sampleSky() {\n' +
                        /* Get the ray from the camera to the vertex and its length (which is the far point of
                         the ray passing through the atmosphere) */
                    '    vec3 point = vertexPoint.xyz + vertexOrigin;\n' +
                    '    vec3 ray = point - eyePoint;\n' +
                    '    float far = length(ray);\n' +
                    '    ray /= far;\n' +

                    '    vec3 start;\n' +
                    '    float startOffset;\n' +

                    '    if (eyeMagnitude < atmosphereRadius) {\n' +
                        /* Calculate the ray's starting point, then calculate its scattering offset */
                    '        start = eyePoint;\n' +
                    '        float height = length(start);\n' +
                    '        float depth = exp(scaleOverScaleDepth * (globeRadius - eyeMagnitude));\n' +
                    '        float startAngle = dot(ray, start) / height;\n' +
                    '        startOffset = depth*scaleFunc(startAngle);\n' +
                    '    } else {\n' +
                        /* Calculate the closest intersection of the ray with the outer atmosphere (which is the near
                         point of the ray passing through the atmosphere) */
                    '        float B = 2.0 * dot(eyePoint, ray);\n' +
                    '        float C = eyeMagnitude2 - atmosphereRadius2;\n' +
                    '        float det = max(0.0, B*B - 4.0 * C);\n' +
                    '        float near = 0.5 * (-B - sqrt(det));\n' +

                        /* Calculate the ray's starting point, then calculate its scattering offset */
                    '        start = eyePoint + ray * near;\n' +
                    '        far -= near;\n' +
                    '        float startAngle = dot(ray, start) / atmosphereRadius;\n' +
                    '        float startDepth = exp(-1.0 / scaleDepth);\n' +
                    '        startOffset = startDepth*scaleFunc(startAngle);\n' +
                    '    }\n' +

                        /* Initialize the scattering loop variables */
                    '    float sampleLength = far / SAMPLES;\n' +
                    '    float scaledLength = sampleLength * scale;\n' +
                    '    vec3 sampleRay = ray * sampleLength;\n' +
                    '    vec3 samplePoint = start + sampleRay * 0.5;\n' +

                        /* Now loop through the sample rays */
                    '    vec3 frontColor = vec3(0.0, 0.0, 0.0);\n' +
                    '    for(int i=0; i<SAMPLE_COUNT; i++)\n' +
                    '    {\n' +
                    '        float height = length(samplePoint);\n' +
                    '        float depth = exp(scaleOverScaleDepth * (globeRadius - height));\n' +
                    '        float lightAngle = dot(lightDirection, samplePoint) / height;\n' +
                    '        float cameraAngle = dot(ray, samplePoint) / height;\n' +
                    '        float scatter = (startOffset + depth*(scaleFunc(lightAngle) - scaleFunc(cameraAngle)));\n' +
                    '        vec3 attenuate = exp(-scatter * (invWavelength * Kr4PI + Km4PI));\n' +
                    '        frontColor += attenuate * (depth * scaledLength);\n' +
                    '        samplePoint += sampleRay;\n' +
                    '    }\n' +

                        /* Finally, scale the Mie and Rayleigh colors and set up the varying variables for the fragment
                         shader */
                    '    primaryColor = frontColor * (invWavelength * KrESun);\n' +
                    '    secondaryColor = frontColor * KmESun;\n' +
                    '    direction = eyePoint - point;\n' +
                    '}\n' +

                    'void main()\n' +
                    '{\n' +
                    '    sampleSky();\n' +

                        /* Transform the vertex point by the modelview-projection matrix */
                    '    gl_Position = mvpMatrix * vertexPoint;\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                    'precision mediump int;\n' +

                    'const int FRAGMODE_SKY = 1;\n' +
                    'const int FRAGMODE_GROUND_PRIMARY = 2;\n' +
                    'const int FRAGMODE_GROUND_SECONDARY = 3;\n' +
                    'const int FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;\n' +

                    'const float g = -0.95;\n' +
                    'const float g2 = g * g;\n' +

                    'uniform int fragMode;\n' +
                    'uniform sampler2D texSampler;\n' +
                    'uniform vec3 lightDirection;\n' +

                    'varying vec3 primaryColor;\n' +
                    'varying vec3 secondaryColor;\n' +
                    'varying vec3 direction;\n' +
                    'varying vec2 texCoord;\n' +

                    'void main (void)\n' +
                    '{\n' +
                    '    if (fragMode == FRAGMODE_SKY) {\n' +
                    '        float cos = dot(lightDirection, direction) / length(direction);\n' +
                    '        float rayleighPhase = 0.75 * (1.0 + cos * cos);\n' +
                    '        float miePhase = 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + cos*cos) / pow(1.0 + g2 - 2.0*g*cos, 1.5);\n' +
                    '        const float exposure = 2.0;\n' +
                    '        vec3 color = primaryColor * rayleighPhase + secondaryColor * miePhase;\n' +
                    '        color = vec3(1.0) - exp(-exposure * color);\n' +
                    '        gl_FragColor = vec4(color, color.b);\n' +
                    '    } else if (fragMode == FRAGMODE_GROUND_PRIMARY) {\n' +
                    '        gl_FragColor = vec4(primaryColor, 1.0);\n' +
                    '    } else if (fragMode == FRAGMODE_GROUND_SECONDARY) {\n' +
                    '        gl_FragColor = vec4(secondaryColor, 1.0);\n' +
                    '    } else if (fragMode == FRAGMODE_GROUND_PRIMARY_TEX_BLEND) {\n' +
                    '        vec4 texColor = texture2D(texSampler, texCoord);\n' +
                    '        gl_FragColor = vec4(primaryColor + texColor.rgb * (1.0 - secondaryColor), 1.0);\n' +
                    '    } else {\n' +
                    'gl_FragColor = vec4(1.0);\n' +
                    '}\n' +
                    '}';

            // Call to the superclass, which performs shader program compiling and linking.
            AtmosphereProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, ["vertexPoint"]);
        };

        SkyProgram.key = "WorldWindSkyProgram";

        SkyProgram.prototype = Object.create(AtmosphereProgram.prototype);

        return SkyProgram;
    });



