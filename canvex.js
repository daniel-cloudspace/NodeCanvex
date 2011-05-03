var spritedefs = {
    player: {
        img: 'player.walk',
        img_w: 47,
        img_h: 59,
        img_off_x: 24,
        img_off_y: 54,
        angles: 8,
        frames: 4,
        speed: 250,
        height: 0.6,
        radius: 0.1
    },
    barrel: {
        img: 'barrel',
        img_w: 25,
        img_h: 34,
        img_off_x: 13,
        img_off_y: 30,
        angles: 1,
        frames: 2,
        speed: 500,
        height: 0.3,
        radius: 0.1
    }
};
var texture_data = {
    loading: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAgAQMAAABuGmlfAAAABlBMVEUAAAD//wCI23BQAAAAO0lEQVQI12P4DwYMDQwMIEwdarHkKZ/FkgxLlmoHLFnKsGSv1rUle4E8rSAgb7fqKZ/dqtS1DysF8RgATqM0NkkHKJUAAAAASUVORK5CYII=',
    error: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAgAQMAAABuGmlfAAAABlBMVEUAAAD/AAAb/40iAAAAMUlEQVQI12P4DwYMDQwMIEwh1V/c8wBIdXgFTQBSfRCqo3gSkmC/l88Eyi0igoJ4DADAqDKnz0GfcgAAAABJRU5ErkJggg=='
};
const mipmap_max = 7;
const mipmap_min = 3;
const mipmap_enabled = 1;
const texture_u_repeat = 192 / 128;
const texture_v_repeat = 144 / 128;
var options_flags = {
    gradient_surfaces: 1,
    horizontal_scale: 8,
    low_textures: 1,
    map: 1,
    draw_from_canvas: 0,
    draw_pattern_walls: 0,
    no_alpha_texture: 0,
    opera_context: 0,
    opera_hack: 1,
    double_buffer: 0,
    textured_floors: 0
};
if (navigator.userAgent.indexOf("Opera") != -1) {
    options_flags.draw_from_canvas = 1;
    options_flags.no_alpha_texture = 1;
    options_flags.double_buffer = 1;
} else {
    options_flags.draw_from_canvas = 0;
    if (options_flags.draw_pattern_walls) {
        options_flags.no_alpha_texture = 1;
    }
}

function $(id) {
    return document.getElementById(id);
}

function debug(str) {
    $('status').value = str;
}
const DOM_VK = {
    CANCEL: 3,
    HELP: 6,
    BACK_SPACE: 8,
    TAB: 9,
    CLEAR: 12,
    RETURN: 13,
    ENTER: 14,
    SHIFT: 16,
    CONTROL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINTSCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    SEMICOLON: 59,
    EQUALS: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CONTEXT_MENU: 93,
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SEPARATOR: 108,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACK_QUOTE: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    QUOTE: 222,
    META: 224
};
(function () {
    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    },
        s = {
            array: function (x) {
                var a = ['['],
                    b, f, i, l = x.length,
                    v;
                for (i = 0; i < l; i += 1) {
                    v = x[i];
                    f = s[typeof v];
                    if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                            }
                            a[a.length] = v;
                            b = true;
                        }
                    }
                }
                a[a.length] = ']';
                return a.join('');
            },
            'boolean': function (x) {
                return String(x);
            },
            'null': function (x) {
                return "null";
            },
            number: function (x) {
                return isFinite(x) ? String(x) : 'null';
            },
            object: function (x) {
                if (x) {
                    if (x instanceof Array) {
                        return s.array(x);
                    }
                    var a = ['{'],
                        b, f, i, v;
                    for (i in x) {
                        v = x[i];
                        f = s[typeof v];
                        if (f) {
                            v = f(v);
                            if (typeof v == 'string') {
                                if (b) {
                                    a[a.length] = ',';
                                }
                                a.push(s.string(i), ':', v);
                                b = true;
                            }
                        }
                    }
                    a[a.length] = '}';
                    return a.join('');
                }
                return 'null';
            },
            string: function (x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            }
        };
    this.toJSONString = function (obj) {
        return s[typeof obj](obj);
    };
    this.parseJSON = function (str) {
        try {
            return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(str.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + str + ')');
        } catch (e) {
            return false;
        }
    };
    this.parseJSON_except = function (str) {
        var j = parseJSON(str);
        if (!j) {
            throw new Error("Invalid JSON string: " + str);
        }
        return j;
    };
    this.cloneViaJSON = function (obj) {
        return eval('(' + this.toJSONString(obj) + ')');
    };
})();
const request_http_privilege = true;
const http_filestore_domain = 'zaynar.demon.co.uk';
const http_filestore = 'http://zaynar.demon.co.uk/misc2/doomcanvas/cgi-bin/filestore.cgi';
const http_filestore_xdm = 'http://zaynar.demon.co.uk/misc2/doomcanvas/filestore_xdm.html';

function save_to_file_store(name, data) {
    try {
        if (request_http_privilege) {
            netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
        }
        var json = toJSONString(data);
        var req = new XMLHttpRequest();
        req.open('POST', http_filestore + '?action=save&name=' + escape(name), false);
        req.send(json);
        return true;
    } catch (e) {
        alert(e);
        return false;
    }
}

function load_from_file_store(name) {
    try {
        if (request_http_privilege) {
            netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
        }
        var req = new XMLHttpRequest();
        req.open('GET', http_filestore + '?action=load&name=' + escape(name), false);
        req.send(null);
        var res = parseJSON(req.responseText);
        if (res) {
            return parseJSON(res.data);
        } else {
            return null;
        }
    } catch (e) {
        alert(e);
        return null;
    }
}

function load_from_file_store_async_xmlhttp(name, handler) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            var res = parseJSON(req.responseText);
            if (res) {
                handler(parseJSON(res.data));
            } else {
                handler();
            }
        }
    };
    req.open('GET', http_filestore + '?action=load&name=' + escape(name), true);
    req.send(null);
}

function load_from_file_store_async(name, handler) {
    try {
        if (document.domain == http_filestore_domain) {
            load_from_file_store_async_xmlhttp(name, handler);
            return true;
        }
    } catch (e) {
        alert(e);
    }
    try {
        if (document.postMessage) {
            var obj = $('xdm_object');

            function on_message(e) {
                if (e.source == obj.contentDocument) {
                    document.removeEventListener('message', on_message, false);
                    var res = parseJSON(e.data);
                    if (res.error) {
                        alert('Failed to retrieve map data: ' + unescape(res.error));
                        handler();
                    } else {
                        handler(parseJSON(res.data));
                    }
                }
            }
            document.addEventListener('message', on_message, false);
            if (!obj) {
                obj = document.createElementNS('http://www.w3.org/1999/xhtml', 'object');
                obj.id = 'xdm_object';
                $('xdm_container').appendChild(obj);
                obj.addEventListener('load', function () {
                    obj.contentDocument.postMessage(name);
                }, false);
                obj.data = http_filestore_xdm;
            } else {
                if (obj.contentDocument && obj.contentDocument.postMessage) {
                    obj.contentDocument.postMessage(name);
                } else {
                    setTimeout(load_from_file_store_async, 100, name, handler);
                }
            }
            return true;
        }
    } catch (e) {
        alert(e);
    }
    try {
        if (request_http_privilege && (document.domain === '' || document.domain == 'localhost')) {
            netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
            load_from_file_store_async_xmlhttp(name, handler);
            return true;
        }
    } catch (e) {}
    return false;
}

function read_local_file(name) {
    if (name.match(/[^a-zA-Z0-9_\.]/) || name.match(/^\./)) {
        alert("Invalid filename - must only contain alphanumerics, '_' and '.'; and must not start with '.'");
        return null;
    }
    try {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var file = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('Home', Components.interfaces.nsIFile);
        file.append('.canvex');
        file.append(name);
        var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
        var istream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
        const replacementChar = Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER;
        fstream.init(file, -1, 0, 0);
        istream.init(fstream, "UTF-8", 1024, replacementChar);
        var str = {};
        var contents = '';
        while (istream.readString(4096, str) !== 0) {
            contents += str.value;
        }
        istream.close();
        fstream.close();
        return parseJSON(contents);
    } catch (e) {
        if (e.name == 'NS_ERROR_FILE_NOT_FOUND') {
            alert('Cannot find file named "' + name + '"');
        } else {
            alert('Unexpected error: ' + e);
        }
        return null;
    }
}

function write_local_file(name, contents) {
    if (name.match(/[^a-zA-Z0-9_\.]/) || name.match(/^\./)) {
        alert("Invalid filename - must only contain alphanumerics, '_' and '.'; and must not start with '.'");
        return false;
    }
    try {
        var json = toJSONString(contents);
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var file = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('Home', Components.interfaces.nsIFile);
        file.append('.canvex');
        if (!file.exists()) {
            file.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 436);
        }
        file.append(name);
        var fstream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        var ostream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        fstream.init(file, 0x02 | 0x08 | 0x20, 436, 0);
        ostream.init(fstream, "UTF-8", 1024, 0x0000);
        ostream.writeString(json);
        ostream.close();
        fstream.close();
        return true;
    } catch (e) {
        alert('Unexpected error: ' + e);
        return false;
    }
}
var profiler_enabled;
var profile_timers = {};
var profile_counters = {};
var profile_samples = 32;
var profile_sampled = 0;

function profile_begin(name) {
    if (profiler_enabled) {
        var t = new Date();
        var ms = t.getMilliseconds() + 1000 * (t.getSeconds() + 60 * t.getMinutes());
        profile_timers[name] = (profile_timers[name] === undefined ? 0 : profile_timers[name]) - ms;
    }
}

function profile_count(name) {
    if (profiler_enabled) {
        profile_counters[name] = (profile_counters[name] === undefined ? 1 : profile_counters[name] + 1);
    }
}

function profile_end(name) {
    if (profiler_enabled) {
        var t = new Date();
        var ms = t.getMilliseconds() + 1000 * (t.getSeconds() + 60 * t.getMinutes());
        profile_timers[name] += ms;
    }
}

function profile_report() {
    if (!profiler_enabled) {
        return;
    }
    if (++profile_sampled < profile_samples) {
        return;
    }
    profile_sampled = 0;
    var s = "";
    for (var n in profile_timers) {
        s += n + ": " + profile_timers[n] / profile_samples + " ms/frame<br/>";
    }
    for (var n in profile_counters) {
        s += n + ": " + profile_counters[n] / profile_samples + " /frame<br/>";
    }
    $('profile').innerHTML = s;
    profile_timers = {};
    profile_counters = {};
}
var framerate_buffer = [];
var framerate_previous_date;
const framerate_buffer_max = 32;
var framerate_last_update;
const framerate_update_time = 1000;

function framerate_update() {
    var now = new Date();
    if (!framerate_previous_date) {
        framerate_previous_date = now;
        framerate_last_update = now;
        return;
    }
    var length = now - framerate_previous_date;
    framerate_previous_date = now;
    framerate_buffer.push(length);
    while (framerate_buffer.length > framerate_buffer_max) {
        framerate_buffer.shift();
    }
    if (now - framerate_last_update > framerate_update_time) {
        framerate_last_update = now;
        var t = 0;
        for (var i = 0; i < framerate_buffer.length; ++i) {
            t += framerate_buffer[i];
        }
        var fps = Math.round(10 * 1000 * framerate_buffer.length / t) / 10;
        $('framerate').innerHTML = fps;
        if (this.ui) {
            ui.set_counter(Math.round(fps));
        }
        var fpsgraph = $('fpsgraph');
        if (fpsgraph) {
            var fpsgraph_doc = $('fpsgraph').contentDocument;
            if (fpsgraph_doc && fpsgraph_doc.fpsgraph_add_profile_sample) {
                fpsgraph_doc.fpsgraph_add_profile_sample(fps);
            }
        }
    }
}

function ray_vs_line(ray_x, ray_y, ray_dx, ray_dy, line_x0, line_y0, line_x1, line_y1) {
    var abx = line_x0 - line_x1;
    var aby = line_y0 - line_y1;
    var acx = line_x0 - ray_x;
    var acy = line_y0 - ray_y;
    var t = (acx * ray_dy - acy * ray_dx) / (abx * ray_dy - aby * ray_dx);
    return t;
}

function line_vs_line(line0_x0, line0_y0, line0_x1, line0_y1, line1_x0, line1_y0, line1_x1, line1_y1) {
    var x_00_10 = line0_x0 - line1_x0;
    var y_00_10 = line0_y0 - line1_y0;
    var x_11_10 = line1_x1 - line1_x0;
    var y_11_10 = line1_y1 - line1_y0;
    var x_01_10 = line0_x1 - line1_x0;
    var y_01_10 = line0_y1 - line1_y0;
    var x_11_00 = line1_x1 - line0_x0;
    var y_11_00 = line1_y1 - line0_y0;
    var x_00_01 = line0_x0 - line0_x1;
    var y_00_01 = line0_y0 - line0_y1;
    if ((x_00_10 * y_11_10 - y_00_10 * x_11_10) * (x_01_10 * y_11_10 - y_01_10 * x_11_10) <= 0 && (x_00_10 * y_00_01 - y_00_10 * x_00_01) * (x_11_00 * y_00_01 - y_11_00 * x_00_01) >= 0) {
        return true;
    } else {
        return false;
    }
}

function line_depth(ray_x, ray_y, ray_dx, ray_dy, line_x0, line_y0, line_x1, line_y1, t) {
    var abx = line_x0 - line_x1;
    var aby = line_y0 - line_y1;
    var acx = line_x0 - ray_x;
    var acy = line_y0 - ray_y;
    var dist = (acx - t * abx) * ray_dx + (acy - t * aby) * ray_dy;
    return dist;
}

function point_depth(x0, y0, dx, dy, x1, y1) {
    return (x1 - x0) * dx + (y1 - y0) * dy;
}

function point_distance(x0, y0, x1, y1) {
    return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}

function line_distance(ray_x, ray_y, line_x0, line_y0, line_x1, line_y1, t) {
    var dx = line_x0 + t * (line_x1 - line_x0) - ray_x;
    var dy = line_y0 + t * (line_y1 - line_y0) - ray_y;
    return Math.sqrt(dx * dx + dy * dy);
}

function ray_line_distance(ray_x, ray_y, ray_dx, ray_dy, line_x0, line_y0, line_x1, line_y1) {
    var abx = line_x0 - line_x1;
    var aby = line_y0 - line_y1;
    var acx = line_x0 - ray_x;
    var acy = line_y0 - ray_y;
    var t = (acx * ray_dy - acy * ray_dx) / (abx * ray_dy - aby * ray_dx);
    if (t < 0 || t >= 1) {
        return Infinity;
    }
    return ((acx - t * abx) * ray_dx + (acy - t * aby) * ray_dy);
}

function point_line_distance_rect(x, y, x0, y0, x1, y1) {
    var len = point_distance(x0, y0, x1, y1);
    var xn = (x1 - x0) / len;
    var yn = (y1 - y0) / len;
    var dist_perp = Math.abs((x - x0) * yn - (y - y0) * xn);
    var dist_para = Math.abs((x - x0) * xn + (y - y0) * yn - len / 2) - len / 2;
    return (dist_perp > dist_para ? dist_perp : dist_para);
}

function point_line_distance_circle(x, y, x0, y0, x1, y1) {
    var len = point_distance(x0, y0, x1, y1);
    var xn = (x1 - x0) / len;
    var yn = (y1 - y0) / len;
    var pos_para = (x - x0) * xn + (y - y0) * yn;
    if (pos_para < 0) {
        return point_distance(x, y, x0, y0);
    } else if (pos_para > len) {
        return point_distance(x, y, x1, y1);
    } else {
        return Math.abs((x - x0) * yn - (y - y0) * xn);
    }
}

function point_line_distance_perp(x, y, x0, y0, x1, y1) {
    var len = point_distance(x0, y0, x1, y1);
    var xn = (x1 - x0) / len;
    var yn = (y1 - y0) / len;
    var pos_para = (x - x0) * xn + (y - y0) * yn;
    if (pos_para < 0 || pos_para > len) {
        return Infinity;
    }
    return Math.abs((x - x0) * yn - (y - y0) * xn);
}

function point_is_in_polygon(x, y, sector) {
    var isctns = 0;
    for (var e = 0; e < sector.edges.length; ++e) {
        var edge = sector.edges[e];
        var t = ray_vs_line(x, y, 1, 0, edge.x0, edge.y0, edge.x1, edge.y1);
        if (t >= 0 && t < 1) {
            var depth = line_depth(x, y, 1, 0, edge.x0, edge.y0, edge.x1, edge.y1, t);
            if (depth > 0) {
                ++isctns;
            }
        }
    }
    return (isctns % 2 ? true : false);
}

function polygon_centre(sector) {
    var xs = 0,
        ys = 0;
    for (var e = 0; e < sector.edges.length; ++e) {
        var edge = sector.edges[e];
        xs += edge.x0;
        ys += edge.y0;
    }
    return {
        x: xs / sector.edges.length,
        y: ys / sector.edges.length
    };
}
var sectors;
var sprites;
const mipmap_bias = -0.5;
const near_clip = 0.01;

function draw_texture_strip(ctx, tex, u0, sy, u1, sh, dx, dy, dw, dh) {
    while (u1 >= texture_u_repeat) {
        var d = Math.floor(dw * (1 - u0) / (u1 - u0));
        ctx.drawImage(tex.img, tex.w * u0, tex.h * sy, tex.w * (1 - u0), tex.h * sh, dx, dy, d, dh);
        dx += d;
        dw -= d;
        u0 = 0;
        u1 -= 1;
    }
    ctx.drawImage(tex.img, tex.w * u0, tex.h * sy, tex.w * (u1 - u0), tex.h * sh, dx, dy, dw, dh);
}

function get_mip(tex, s) {
    var miplevel = Math.ceil(mipmap_bias + Math.log(s) / Math.LN2);
    if (miplevel < mipmap_min) {
        miplevel = mipmap_min;
    } else if (miplevel >= tex.length) {
        miplevel = tex.length - 1;
    } else if (isNaN(miplevel)) {
        miplevel = mipmap_min;
    }
    return tex[miplevel];
}

function get_mip_level(tex, s) {
    var miplevel = Math.ceil(mipmap_bias + Math.log(s) / Math.LN2);
    if (miplevel < mipmap_min) {
        miplevel = mipmap_min;
    } else if (miplevel >= tex.length) {
        miplevel = tex.length - 1;
    } else if (isNaN(miplevel)) {
        miplevel = mipmap_min;
    }
    return miplevel;
}

function draw_texture(ctx, h, clip_y0, clip_y1, tex, sx, sy, sw, sh, dx, dy, dw, dh) {
    var miptex;
    if (sw < 1e-6) {
        return;
    }
    if (options_flags.draw_pattern_walls) {
        miptex = get_mip(tex, dw / sw);
        try {
            ctx.save();
            ctx.fillStyle = miptex.img;
            ctx.scale(dw / (sw * miptex.w), dh / (sh * miptex.h));
            ctx.translate((dx * sw / dw - sx) * miptex.w, (dy * sh / dh - sy) * miptex.h);
            ctx.fillRect(sx * miptex.w, sy * miptex.h, sw * miptex.w, sh * miptex.w);
            ctx.restore();
        } catch (e) {
            debug(e);
        }
    } else {
        var u0 = (sx < 0 ? 1 + sx % 1 : sx % 1);
        var v0 = (sy < 0 ? 1 + sy % 1 : sy % 1);
        var v1 = v0 + sh;
        while (v1 >= texture_v_repeat) {
            var d = Math.floor(dh * (1 - v0) / (v1 - v0));
            if (dy < clip_y1 && dy + d >= clip_y0 && d > 0) {
                if (!miptex) {
                    miptex = get_mip(tex, dw / sw);
                }
                draw_texture_strip(ctx, miptex, u0, v0, u0 + sw, 1 - v0, dx, dy, dw, d);
            }
            dy += d;
            dh -= d;
            v0 = 0;
            v1 -= 1;
        }
        if (dy < clip_y1 && dy + dh >= clip_y0 && dh > 0) {
            if (!miptex) {
                miptex = get_mip(tex, dw / sw);
            }
            draw_texture_strip(ctx, miptex, u0, v0, u0 + sw, v1 - v0, dx, dy, dw, dh);
        }
    }
}

function sprite_sort(a, b) {
    return (a.w > b.w ? -1 : a.w < b.w ? 1 : 0);
}

function render_sprites(ctx, camera, sector, x0, x1, w, h) {
    var sorted_sprites = [];
    for (var s in sector.sprites) {
        var sprite = sprites[s];
        var depth = point_depth(camera.x, camera.y, camera.dx, camera.dy, sprite.x, sprite.y);
        if (depth > 0) {
            sorted_sprites.push({
                sprite: sprite,
                w: depth
            });
        }
    }
    sorted_sprites.sort(sprite_sort);
    ctx.beginPath();
    for (var s = 0; s < sorted_sprites.length; ++s) {
        var sprite = sorted_sprites[s].sprite;
        var depth = sorted_sprites[s].w;
        var numframes = sprite.spritedef.sprite.frames;
        var numangles = sprite.spritedef.sprite.angles;
        var frame = Math.floor(camera.t * 1000 / sprite.spritedef.sprite.speed) % numframes;
        var angle = Math.PI + sprite.a - Math.atan2(sprite.y - camera.y, sprite.x - camera.x);
        angle = (numangles + Math.round(angle * numangles / (2 * Math.PI))) % numangles;
        var tex = sprite.spritedef.images[frame + angle * numframes];
        var x = w * (0.5 + uncast_ray(sprite.x, sprite.y, camera));
        var height = h * (sprite.spritedef.sprite.height / depth);
        var width = height * tex.w / tex.h;
        var clipped_x0 = x - width / 2;
        var clipped_x1 = x + width / 2;
        if (clipped_x0 < x1 && clipped_x1 > x0) {
            var zbase = h * (0.5 - (-camera.z + sprite.z) / depth);
            var u0 = 0,
                u1 = 1;
            if (clipped_x0 < x0) {
                u0 = (x0 - clipped_x0) / width;
                clipped_x0 = x0;
            }
            if (clipped_x1 > x1) {
                u1 = 1 - (clipped_x1 - x1) / width;
                clipped_x1 = x1;
            }
            ctx.drawImage(tex.img, u0 * tex.w, 0, (u1 - u0) * (tex.w - 0.01), tex.h, clipped_x0, zbase - height, clipped_x1 - clipped_x0, height);
        }
    }
}

function render(w, h, ctx, dctx, camera) {
    var dh = Math.floor(camera.dh * h);
    if (dh !== 0) {
        ctx.save();
        ctx.translate(0, dh);
    }
    render_rays(0, w, -dh, h - dh, camera.s, w, h, ctx, dctx, camera, 0);
    if (dh !== 0) {
        ctx.restore();
    }
}

function max_abs(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    return x > y ? x : y;
}

function draw_poly(ctx, h, tex, x, edge_end, clip_y0, clip_y1, bot0, top0, bot1, top1, w0, w1, u0, u1, v0, v1, floor, ceiling, lighting, solid) {
    if (w0 < near_clip || w1 < near_clip) {
        return;
    }
    ctx.beginPath();
    u0 = u0 * tex.uscale + tex.u;
    u1 = u1 * tex.uscale + tex.u;
    v0 = v0 * tex.vscale + tex.v;
    v1 = v1 * tex.vscale + tex.v;
    var u0w = u0 / w0;
    var u1w = u1 / w1;
    var dtop = (top1 - top0) / (edge_end - x);
    var dbot = (bot1 - bot0) / (edge_end - x);
    var dt = 1 / (edge_end - x);
    var t = 0;
    var top = top0;
    var bot = bot0;
    var xp = x;
    var max_dy = 2;
    var min_dx = 8;
    var max_dx = Infinity;
    var dy = max_abs(dtop, dbot);
    var dx = Math.floor(max_dy / dy);
    if (dx < min_dx) {
        dx = min_dx;
    }
    if (dx > max_dx) {
        dx = max_dx;
    }
    if (dtop > 0) {
        top += dtop * dx;
    }
    if (dbot < 0) {
        bot += dbot * dx;
    }
    var alpha_texture = !(solid && !options_flags.no_alpha_texture);
    if (!alpha_texture && lighting < 1) {
        ctx.globalAlpha = lighting;
    }
    if (!solid) {
        ctx.beginPath();
        ctx.rect(0, 0, 0, 0);
        ctx.stroke();
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, bot0);
        ctx.lineTo(edge_end, bot1);
        ctx.lineTo(edge_end, top1);
        ctx.lineTo(x, top0);
        ctx.clip();
    }
    var u = u0;
    while (xp < edge_end) {
        profile_count("draw strip");
        if (xp + dx > edge_end) {
            dx = edge_end - xp;
        }
        t += dx * dt;
        if (top >= clip_y0 && bot < clip_y1) {
            if (v1 > v0) {
                var topi = Math.floor(top);
                var boti = Math.floor(bot);
                var ul = u;
                u = ((1 - t) * u0w + t * u1w) / ((1 - t) / w0 + t / w1);
                draw_texture(ctx, h, clip_y0, clip_y1, tex.tex, ul, v0, u - ul, v1 - v0, xp, boti, dx, topi - boti + 1);
                if (alpha_texture && lighting < 1) {
                    ctx.fillStyle = '#000000';
                    ctx.globalAlpha = 1 - lighting;
                    ctx.fillRect(xp, boti, dx, topi - boti + 1);
                    ctx.globalAlpha = 1;
                }
            }
        }
        xp += dx;
        top += dx * dtop;
        bot += dx * dbot;
    }
    if (!solid) {
        ctx.restore();
    }
    if (!alpha_texture && lighting < 1) {
        ctx.globalAlpha = 1;
    }
    if (floor && (top0 < clip_y1 || top1 < clip_y1)) {
        if (!options_flags.textured_floors) {
            ctx.fillStyle = floor;
            ctx.beginPath();
            ctx.moveTo(x, clip_y1);
            ctx.lineTo(x, top0);
            ctx.lineTo(edge_end, top1);
            ctx.lineTo(edge_end, clip_y1);
            ctx.fill();
        }
    }
    if (ceiling && (bot0 >= clip_y0 || bot1 >= clip_y0)) {
        ctx.fillStyle = ceiling;
        ctx.beginPath();
        ctx.moveTo(x, clip_y0 - 1);
        ctx.lineTo(x, bot0);
        ctx.lineTo(edge_end, bot1);
        ctx.lineTo(edge_end, clip_y0 - 1);
        ctx.fill();
    }
}

function draw_floor(dctx, ctx, h, w, camera, isctn0, isctn1, sector, clip_y, x0, x1, y0, y1) {
    const step = 2;
    const r = 2 * 32;
    var z = sector.floor_height - camera.z;
    ctx.beginPath();
    ctx.rect(0, 0, 0, 0);
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1, clip_y);
    ctx.lineTo(x0, clip_y);
    ctx.closePath();
    ctx.clip();
    for (var screeny = Math.floor(Math.min(y0, y1)); screeny < clip_y; screeny += step) {
        var d = z / (0.5 - screeny / h);
        var c0 = ray_coords(d, x0 / w - 0.5, camera);
        var c1 = ray_coords(d, x1 / w - 0.5, camera);
        var s_over_uv = (x1 - x0) / (r * point_distance(c0.x, c0.y, c1.x, c1.y));
        var angle = Math.atan2(c0.y - c1.y, c0.x - c1.x);
        var cos_scaled = Math.cos(angle) / s_over_uv;
        var sin_scaled = Math.sin(angle) / s_over_uv;
        var tx = (cos_scaled * x0 - sin_scaled * screeny) + c0.x * r;
        var ty = (sin_scaled * x0 + cos_scaled * screeny) + c0.y * r;
        var y0b = screeny;
        var y1b = screeny + step;
        var x0b = x0;
        var x0c = x0;
        var x1b = x1;
        var x1c = x1;
        var mip = get_mip_level(sector.floor, s_over_uv / 48);
        var s = 128 / Math.pow(2, mip);
        ctx.fillStyle = sector.floor[mip].img;
        ctx.save();
        ctx.scale(s_over_uv * s, s_over_uv * s);
        ctx.rotate(-angle);
        ctx.translate(tx / s, ty / s);
        ctx.beginPath();
        ctx.moveTo((x0c * cos_scaled - y1b * sin_scaled - tx) / s, (x0c * sin_scaled + y1b * cos_scaled - ty) / s);
        ctx.lineTo((x0b * cos_scaled - y0b * sin_scaled - tx) / s, (x0b * sin_scaled + y0b * cos_scaled - ty) / s);
        ctx.lineTo((x1b * cos_scaled - y0b * sin_scaled - tx) / s, (x1b * sin_scaled + y0b * cos_scaled - ty) / s);
        ctx.lineTo((x1c * cos_scaled - y1b * sin_scaled - tx) / s, (x1c * sin_scaled + y1b * cos_scaled - ty) / s);
        ctx.fill();
        ctx.restore();
    }
    ctx.restore();
}

function render_rays(x0, x1, y0, y1, sector, w, h, ctx, dctx, camera, limit) {
    var x = x0;
    var isctn0 = cast_ray(sector, x / w - 0.5, camera);
    while (x < x1) {
        profile_count("cast strip");
        if (dctx) {
            var px = x / w - 0.5;
            dctx.strokeStyle = '#ff0000';
            dctx.beginPath();
            dctx.moveTo(camera.x, camera.y);
            dctx.lineTo(camera.x + camera.dx - px * camera.dy, camera.y + camera.dy + px * camera.dx);
            dctx.stroke();
        }
        var edge = isctn0.edge;
        if (!edge) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, 0, 1, h);
            ++x;
            isctn0 = cast_ray(sector, x / w - 0.5, camera);
        } else {
            if (dctx) {
                dctx.strokeStyle = '#0000ff';
                dctx.beginPath();
                dctx.moveTo(camera.x, camera.y);
                dctx.lineTo(edge.x1, edge.y1);
                dctx.stroke();
            }
            var edge_end = Math.floor(1 + w * (0.5 + uncast_ray(edge.x1, edge.y1, camera)));
            var isctn1;
            if (edge_end > x1) {
                edge_end = x1;
                isctn1 = cast_ray_edge(edge, x1 / w - 0.5, camera);
            } else {
                isctn1 = {
                    dist: point_depth(camera.x, camera.y, camera.dx, camera.dy, edge.x1, edge.y1),
                    u: edge.len
                };
            }
            if (edge.dest === null) {
                var bottom0 = h * (0.5 - (-camera.z + sector.ceiling_height) / isctn0.dist);
                var top0 = h * (0.5 - (-camera.z + sector.floor_height) / isctn0.dist);
                var bottom1 = h * (0.5 - (-camera.z + sector.ceiling_height) / isctn1.dist);
                var top1 = h * (0.5 - (-camera.z + sector.floor_height) / isctn1.dist);
                var w0 = isctn0.dist;
                var w1 = isctn1.dist;
                var u0 = isctn0.u;
                var u1 = isctn1.u;
                var v0 = -sector.ceiling_height;
                var v1 = -sector.floor_height;
                draw_poly(ctx, h, edge.lower, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, sector.floor, sector.ceiling, sector.light, true);
                if (options_flags.textured_floors) {
                    draw_floor(dctx, ctx, h, w, camera, isctn0, isctn1, sector, y1, x, edge_end, top0, top1);
                }
            } else {
                var bottom0 = h * (0.5 - (-camera.z + Math.max(sector.floor_height, edge.dest.floor_height)) / isctn0.dist);
                var top0 = h * (0.5 - (-camera.z + Math.min(sector.ceiling_height, edge.dest.ceiling_height)) / isctn0.dist);
                var bottom1 = h * (0.5 - (-camera.z + Math.max(sector.floor_height, edge.dest.floor_height)) / isctn1.dist);
                var top1 = h * (0.5 - (-camera.z + Math.min(sector.ceiling_height, edge.dest.ceiling_height)) / isctn1.dist);
                var y0r = Math.min(top0, top1);
                var y1r = Math.max(bottom0 + 1, bottom1 + 1);
                if (y0r <= y1r && y1r >= y0 && y0r < y1) {
                    render_rays(x, edge_end, Math.max(y0, y0r), Math.min(y1, y1r), edge.dest, w, h, ctx, dctx, camera, limit);
                }
                var w0 = isctn0.dist;
                var w1 = isctn1.dist;
                var u0 = isctn0.u;
                var u1 = isctn1.u;
                if (edge.middle.tex) {
                    var v0 = -sector.ceiling_height;
                    var v1 = -sector.floor_height;
                    var bottom0 = h * (0.5 - (-camera.z + sector.ceiling_height) / isctn0.dist);
                    var top0 = h * (0.5 - (-camera.z + sector.floor_height) / isctn0.dist);
                    var bottom1 = h * (0.5 - (-camera.z + sector.ceiling_height) / isctn1.dist);
                    var top1 = h * (0.5 - (-camera.z + sector.floor_height) / isctn1.dist);
                    draw_poly(ctx, h, edge.middle, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, null, null, sector.light, false);
                }
                var bottom0 = h * (0.5 - (-camera.z + edge.dest.floor_height) / isctn0.dist);
                var top0 = h * (0.5 - (-camera.z + sector.floor_height) / isctn0.dist);
                var bottom1 = h * (0.5 - (-camera.z + edge.dest.floor_height) / isctn1.dist);
                var top1 = h * (0.5 - (-camera.z + sector.floor_height) / isctn1.dist);
                var v1 = -sector.floor_height;
                var v0 = -edge.dest.floor_height;
                draw_poly(ctx, h, edge.lower, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, sector.floor, null, sector.light, false);
                if (options_flags.textured_floors) {
                    draw_floor(dctx, ctx, h, w, camera, isctn0, isctn1, sector, y1, x, edge_end, top0, top1);
                }
                var bottom0 = h * (0.5 - (-camera.z + sector.ceiling_height) / isctn0.dist);
                var top0 = h * (0.5 - (-camera.z + edge.dest.ceiling_height) / isctn0.dist);
                var bottom1 = h * (0.5 - (-camera.z + sector.ceiling_height) / isctn1.dist);
                var top1 = h * (0.5 - (-camera.z + edge.dest.ceiling_height) / isctn1.dist);
                var v1 = -edge.dest.ceiling_height;
                var v0 = -sector.ceiling_height;
                draw_poly(ctx, h, edge.upper, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, null, sector.ceiling, sector.light, false);
            }
            if (edge_end > x) {
                x = edge_end;
                if (x < x1) {
                    isctn0 = cast_ray(sector, x / w - 0.5, camera);
                }
            } else {
                ++x;
                if (x < x1) {
                    isctn0 = {
                        edge: edge.next,
                        dist: point_depth(camera.x, camera.y, camera.dx, camera.dy, edge.next.x0, edge.next.y0),
                        u: 0
                    };
                }
            }
        }
    }
    ctx.beginPath();
    ctx.rect(0, 0, 0, 0);
    ctx.stroke();
    render_sprites(ctx, camera, sector, x0, x1, w, h);
}

function uncast_ray(x, y, camera) {
    x -= camera.x;
    y -= camera.y;
    var y2 = x * camera.dx + y * camera.dy;
    if (y2 <= 0) {
        return Infinity;
    }
    var x2 = x * camera.dy - y * camera.dx;
    return -x2 / y2;
}

function cast_ray(sector, px, camera) {
    var ray_dx = camera.dx - camera.dy * px;
    var ray_dy = camera.dy + camera.dx * px;
    var mag = Math.sqrt(ray_dx * ray_dx + ray_dy * ray_dy);
    ray_dx /= mag;
    ray_dy /= mag;
    var ray_x = camera.x;
    var ray_y = camera.y;
    var closest_edge = null,
        closest_t, closest_dist2;
    var closest_dist = Infinity;
    for (var e = 0; e < sector.edges.length; ++e) {
        var edge = sector.edges[e];
        var t = ray_vs_line(ray_x, ray_y, ray_dx, ray_dy, edge.x0, edge.y0, edge.x1, edge.y1);
        if (t >= 0 && t < 1) {
            var side = (camera.x - edge.x0) * (edge.y1 - edge.y0) - (camera.y - edge.y0) * (edge.x1 - edge.x0);
            if (side < 0) {
                var dist = line_depth(camera.x, camera.y, camera.dx, camera.dy, edge.x0, edge.y0, edge.x1, edge.y1, t);
                if (dist > 0 && dist < closest_dist) {
                    closest_edge = edge;
                    closest_t = t;
                    closest_dist = dist;
                }
            }
        }
    }
    if (closest_edge) {
        var u = closest_t * closest_edge.len;
    }
    return {
        edge: closest_edge,
        dist: closest_dist,
        u: u
    };
}

function cast_ray_edge(edge, px, camera) {
    var ray_dx = camera.dx - camera.dy * px;
    var ray_dy = camera.dy + camera.dx * px;
    var mag = Math.sqrt(ray_dx * ray_dx + ray_dy * ray_dy);
    ray_dx /= mag;
    ray_dy /= mag;
    var ray_x = camera.x;
    var ray_y = camera.y;
    var t = ray_vs_line(ray_x, ray_y, ray_dx, ray_dy, edge.x0, edge.y0, edge.x1, edge.y1);
    var dist = line_depth(camera.x, camera.y, camera.dx, camera.dy, edge.x0, edge.y0, edge.x1, edge.y1, t);
    var u = t * edge.len;
    return {
        edge: edge,
        dist: dist,
        u: u
    };
}

function ray_coords(depth, px, camera) {
    var ray_dx = camera.dx - camera.dy * px;
    var ray_dy = camera.dy + camera.dx * px;
    depth /= camera.dx * ray_dx + camera.dy * ray_dy;
    return {
        x: camera.x + depth * ray_dx,
        y: camera.y + depth * ray_dy
    };
}

function render_frame(ctx, dctx, gctx, w, h, camera) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    profile_begin('render');
    render(w, h, ctx, dctx, camera);
    profile_end('render');
    if (gctx) {
        if (!options_flags.opera_hack) {
            gctx.lockCanvasUpdates(false);
            gctx.updateCanvas();
            gctx.lockCanvasUpdates(true);
        } else {
            $('c').style.width = ($('c').style.width == '640px' ? '639px' : '640px');
        }
    }
}
var paused_img;

function render_paused(ctx, w, h) {
    if (!paused_img) {
        paused_img = new Image();
        paused_img.src = 'textures/misc/paused.png';
    }
    if (!paused_img.complete) {
        setTimeout(render_paused, 100, ctx, w, h);
        return;
    }
    var dw = w * 0.8;
    var dh = dw * (paused_img.height / paused_img.width);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(paused_img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
var level;
var player = {
    x: -1,
    y: 0,
    z: 0.5,
    dx: Math.cos(0),
    dy: Math.sin(0),
    dh: 0,
    vz: 0,
    sector_id: 0,
    s: undefined,
    radius: 0.2,
    height: 0.5,
    eyeline: 0.4,
    maxstep: 0.15
};
var map_scale = 22;
var map_shift_x = 0;
var map_shift_y = 0;
var level = {
    sprites: [{
        y: -0.03125,
        a: 3.14159265358979,
        sprite: "player",
        sector: 3,
        x: 3.59375,
        z: -0.1
    }, {
        y: -1.60918809660903,
        a: 0,
        sprite: "barrel",
        sector: 0,
        x: -1.79641548873723,
        z: -0.1
    }, {
        y: -1.8404084954868,
        a: 0,
        sprite: "barrel",
        sector: 0,
        x: -1.59602447637649,
        z: -0.1
    }, {
        y: -1.8404084954868,
        a: 0,
        sprite: "barrel",
        sector: 0,
        x: -1.82724487525426,
        z: -0.1
    }, {
        y: -1.80957910896976,
        a: 0,
        sprite: "barrel",
        sector: 0,
        x: 1.88769620004855,
        z: -0.1
    }, {
        y: 1.87453257981601,
        a: 0,
        sprite: "barrel",
        sector: 0,
        x: -1.84265956851278,
        z: -0.1
    }, {
        y: -2.33367867975937,
        a: 0,
        sprite: "barrel",
        sector: 5,
        x: -2.38217383256091,
        z: -0.1
    }],
    sectors: [{
        floor_height: -0.1,
        ceiling: [99, 69, 63],
        edges: [{
            y1: -2,
            dest: 2,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: -2,
            x1: -2
        }, {
            y1: 2,
            dest: 5,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: 2,
            x1: -2
        }, {
            y1: 2,
            dest: 4,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: 2,
            x1: 2
        }, {
            y1: -2,
            dest: 3,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: -2,
            x1: 2
        }],
        floor: [37, 17, 129],
        ceiling_height: 1.05,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -0.75,
            dest: 24,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.25,
            x0: -4,
            x1: -4
        }, {
            y1: -0.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.25,
            x0: -4,
            x1: -4
        }, {
            y1: 0.25,
            dest: 23,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.75,
            x0: -4,
            x1: -4
        }, {
            y1: 0.75,
            dest: 8,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: -2.5,
            x1: -4
        }, {
            y1: 2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: -2,
            x1: -2.5
        }, {
            y1: 2,
            dest: 1,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: -2,
            x1: -2
        }, {
            y1: -2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: -2.5,
            x1: -2
        }, {
            y1: -2,
            dest: 6,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.75,
            x0: -4,
            x1: -2.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -4,
            dest: 6,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2.5,
            x0: -2,
            x1: -0.5
        }, {
            y1: -2.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: -2,
            x1: -2
        }, {
            y1: -2,
            dest: 1,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: 2,
            x1: -2
        }, {
            y1: -2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2.5,
            x0: 2,
            x1: 2
        }, {
            y1: -2.5,
            dest: 7,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 0.5,
            x1: 2
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 0.25,
            x1: 0.5
        }, {
            y1: -4,
            dest: 33,
            tex: {
                l: {
                    u: 0,
                    n: "door15_4",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 0.5,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -0.25,
            x1: 0.25
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -0.5,
            x1: -0.25
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.9
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -2,
            dest: 1,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: 2,
            x1: 2
        }, {
            y1: 2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: 2.5,
            x1: 2
        }, {
            y1: 2,
            dest: 26,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 4,
            x1: 2.5
        }, {
            y1: 0.5,
            dest: 10,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.5,
            x0: 4,
            x1: 4
        }, {
            y1: -0.5,
            dest: 7,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: 2.5,
            x1: 4
        }, {
            y1: -2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: 2,
            x1: 2.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.5,
            x0: -2,
            x1: -2
        }, {
            y1: 2.5,
            dest: 8,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: -0.5,
            x1: -2
        }, {
            y1: 4,
            dest: 14,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 0.5,
            x1: -0.5
        }, {
            y1: 4,
            dest: 9,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.5,
            x0: 2,
            x1: 0.5
        }, {
            y1: 2.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: 2,
            x1: 2
        }, {
            y1: 2,
            dest: 1,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: -2,
            x1: 2
        }],
        floor: [79, 27, 27],
        ceiling_height: 2,
        light: 0.6
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.75,
            x0: -4,
            x1: -4
        }, {
            y1: -0.75,
            dest: 2,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: -2.5,
            x1: -4
        }, {
            y1: -2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2.5,
            x0: -2,
            x1: -2.5
        }, {
            y1: -2.5,
            dest: 3,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -0.5,
            x1: -2
        }, {
            y1: -4,
            dest: 31,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -1.75,
            x1: -0.5
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -4,
            x1: -1.75
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -4,
            dest: 3,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2.5,
            x0: 2,
            x1: 0.5
        }, {
            y1: -2.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -2,
            x0: 2.5,
            x1: 2
        }, {
            y1: -2,
            dest: 4,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.5,
            x0: 4,
            x1: 2.5
        }, {
            y1: -0.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 4,
            x1: 4
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 1.75,
            x1: 4
        }, {
            y1: -4,
            dest: 32,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 0.5,
            x1: 1.75
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 2,
            dest: 2,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.75,
            x0: -4,
            x1: -2.5
        }, {
            y1: 0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: -4,
            x1: -4
        }, {
            y1: 4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: -0.5,
            x1: -4
        }, {
            y1: 4,
            dest: 5,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.5,
            x0: -2,
            x1: -0.5
        }, {
            y1: 2.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: -2.5,
            x1: -2
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 2.5,
            dest: 5,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 0.5,
            x1: 2
        }, {
            y1: 4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 2.5,
            x1: 0.5
        }, {
            y1: 4,
            dest: 28,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3.25,
            x0: 2.75,
            x1: 2.5
        }, {
            y1: 3.25,
            dest: 29,
            tex: {
                l: {
                    u: 0,
                    n: "crate_drtyow",
                    us: 0.353,
                    vs: 0.353,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3,
            x0: 2.5,
            x1: 2.75
        }, {
            y1: 3,
            dest: 26,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.5,
            x0: 2,
            x1: 2.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -0.5,
            dest: 4,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 4,
            x1: 4
        }, {
            y1: 0.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 5.25,
            x1: 4
        }, {
            y1: 0.5,
            dest: 11,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.5,
            x0: 5.25,
            x1: 5.25
        }, {
            y1: -0.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.5,
            x0: 4,
            x1: 5.25
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -0.5,
            dest: 10,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 5.25,
            x1: 5.25
        }, {
            y1: 0.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 1,
            x0: 5.75,
            x1: 5.25
        }, {
            y1: 1,
            dest: 12,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 1,
            x0: 6.25,
            x1: 5.75
        }, {
            y1: 1,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 6.75,
            x1: 6.25
        }, {
            y1: 0.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.5,
            x0: 6.75,
            x1: 6.75
        }, {
            y1: -0.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -1,
            x0: 6.25,
            x1: 6.75
        }, {
            y1: -1,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -1,
            x0: 5.75,
            x1: 6.25
        }, {
            y1: -1,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.5,
            x0: 5.25,
            x1: 5.75
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 1,
            dest: 11,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 1,
            x0: 5.75,
            x1: 6.25
        }, {
            y1: 1,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.25,
            x0: 5,
            x1: 5.75
        }, {
            y1: 4.25,
            dest: 13,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.5,
            x0: 6.25,
            x1: 5
        }, {
            y1: 5.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5,
            x0: 6.75,
            x1: 6.25
        }, {
            y1: 5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.25,
            x0: 7,
            x1: 6.75
        }, {
            y1: 4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 1,
            x0: 6.25,
            x1: 7
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.5,
            dest: 12,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.25,
            x0: 5,
            x1: 6.25
        }, {
            y1: 4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 3,
            x1: 5
        }, {
            y1: 4.5,
            dest: 15,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 3,
            x1: 3
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.5,
            x0: 6.25,
            x1: 3
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0.7,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 22,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 0.5,
            x1: -0.5
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 0.5,
            x1: 0.5
        }, {
            y1: 4,
            dest: 5,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: -0.5,
            x1: 0.5
        }, {
            y1: 4,
            dest: 0,
            tex: {
                l: {
                    u: 0.5,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: -0.5,
            x1: -0.5
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.6,
        light: 0.6
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 13,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 3,
            x1: 3
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0.25,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 2.25,
            x1: 3
        }, {
            y1: 4.5,
            dest: 16,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.04
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 2.25,
            x1: 2.25
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 3,
            x1: 2.25
        }],
        floor: [56, 32, 32],
        ceiling_height: 1,
        light: 0.5
    }, {
        floor_height: 0.1,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 15,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 2.25,
            x1: 2.25
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 2,
            x1: 2.25
        }, {
            y1: 4.5,
            dest: 17,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.14
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 2,
            x1: 2
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.75,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 2.25,
            x1: 2
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.1,
        light: 0.5
    }, {
        floor_height: 0.2,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 16,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 2,
            x1: 2
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0.75,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1.75,
            x1: 2
        }, {
            y1: 4.5,
            dest: 18,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.24
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1.75,
            x1: 1.75
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 2,
            x1: 1.75
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.1,
        light: 0.6
    }, {
        floor_height: 0.3,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 17,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1.75,
            x1: 1.75
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0.5,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1.5,
            x1: 1.75
        }, {
            y1: 4.5,
            dest: 19,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.34
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1.5,
            x1: 1.5
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.25,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1.75,
            x1: 1.5
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.1,
        light: 0.6
    }, {
        floor_height: 0.4,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 18,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1.5,
            x1: 1.5
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0.25,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1.25,
            x1: 1.5
        }, {
            y1: 4.5,
            dest: 20,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.44
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1.25,
            x1: 1.25
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.5,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1.5,
            x1: 1.25
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.2,
        light: 0.7
    }, {
        floor_height: 0.5,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 19,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1.25,
            x1: 1.25
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1,
            x1: 1.25
        }, {
            y1: 4.5,
            dest: 21,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.54
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1,
            x1: 1
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.75,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1.25,
            x1: 1
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.3,
        light: 0.8
    }, {
        floor_height: 0.6,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 20,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 1,
            x1: 1
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0.75,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 0.75,
            x1: 1
        }, {
            y1: 4.5,
            dest: 22,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_1",
                    us: 1,
                    vs: 1,
                    v: 0.64
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 0.75,
            x1: 0.75
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 1,
            x1: 0.75
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.4,
        light: 0.9
    }, {
        floor_height: 0.7,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 5.25,
            dest: 21,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 0.75,
            x1: 0.75
        }, {
            y1: 4.5,
            dest: 0,
            tex: {
                l: {
                    u: 0.5,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4.5,
            x0: 0.5,
            x1: 0.75
        }, {
            y1: 4.5,
            dest: 14,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: -0.5,
            x1: 0.5
        }, {
            y1: 5.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.25,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 5.25,
            x0: 0.75,
            x1: -0.5
        }],
        floor: [32, 32, 32],
        ceiling_height: 1.6,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 0.75,
            dest: 2,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.25,
            x0: -4,
            x1: -4
        }, {
            y1: 0.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.75,
            x0: -4.5,
            x1: -4
        }, {
            y1: -0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -1,
            x0: -5,
            x1: -4.5
        }, {
            y1: -1,
            dest: 25,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.25,
            x0: -5,
            x1: -5
        }, {
            y1: -0.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.75,
            x0: -4.5,
            x1: -5
        }, {
            y1: 0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.75,
            x0: -4,
            x1: -4.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -0.25,
            dest: 2,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.75,
            x0: -4,
            x1: -4
        }, {
            y1: -0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.75,
            x0: -4.5,
            x1: -4
        }, {
            y1: -0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.25,
            x0: -5,
            x1: -4.5
        }, {
            y1: 0.25,
            dest: 30,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 1,
            x0: -5,
            x1: -5
        }, {
            y1: 1,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.75,
            x0: -4.5,
            x1: -5
        }, {
            y1: 0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.25,
            x0: -4,
            x1: -4.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.7
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -0.25,
            dest: 23,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -1,
            x0: -5,
            x1: -5
        }, {
            y1: -1,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.75,
            x0: -5.75,
            x1: -5
        }, {
            y1: -0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0,
            x0: -6.25,
            x1: -5.75
        }, {
            y1: 0,
            dest: 30,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0,
            x0: -5.25,
            x1: -6.25
        }, {
            y1: 0,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -0.25,
            x0: -5,
            x1: -5.25
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.9
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 2.5,
            dest: 9,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3,
            x0: 2.5,
            x1: 2
        }, {
            y1: 3,
            dest: 29,
            tex: {
                l: {
                    u: 0,
                    n: "crate_drtyow_sign",
                    us: 0.353,
                    vs: 0.353,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.75,
            x0: 2.75,
            x1: 2.5
        }, {
            y1: 2.75,
            dest: 27,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 4,
            x1: 2.75
        }, {
            y1: 0.5,
            dest: 4,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2,
            x0: 2.5,
            x1: 4
        }, {
            y1: 2,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.5,
            x0: 2,
            x1: 2.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 0.5,
            dest: 26,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.75,
            x0: 2.75,
            x1: 4
        }, {
            y1: 2.75,
            dest: 29,
            tex: {
                l: {
                    u: 0,
                    n: "crate_drtyow",
                    us: 0.353,
                    vs: 0.353,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3,
            x0: 3,
            x1: 2.75
        }, {
            y1: 3,
            dest: 28,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 4,
            x1: 3
        }, {
            y1: 4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.5,
            x0: 4,
            x1: 4
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 3.25,
            dest: 9,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 2.5,
            x1: 2.75
        }, {
            y1: 4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 4,
            x0: 4,
            x1: 2.5
        }, {
            y1: 4,
            dest: 27,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3,
            x0: 3,
            x1: 4
        }, {
            y1: 3,
            dest: 29,
            tex: {
                l: {
                    u: 0,
                    n: "crate_drtyow_sign",
                    us: 0.353,
                    vs: 0.353,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3.25,
            x0: 2.75,
            x1: 3
        }],
        floor: [69, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0.353,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 3,
            dest: 9,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3.25,
            x0: 2.75,
            x1: 2.5
        }, {
            y1: 3.25,
            dest: 28,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3,
            x0: 3,
            x1: 2.75
        }, {
            y1: 3,
            dest: 27,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 2.75,
            x0: 2.75,
            x1: 3
        }, {
            y1: 2.75,
            dest: 26,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 3,
            x0: 2.5,
            x1: 2.75
        }],
        floor: [108, 79, 46],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: 0,
            dest: 25,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0,
            x0: -6.25,
            x1: -5.25
        }, {
            y1: 0,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.75,
            x0: -5.75,
            x1: -6.25
        }, {
            y1: 0.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 1,
            x0: -5,
            x1: -5.75
        }, {
            y1: 1,
            dest: 24,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0.25,
            x0: -5,
            x1: -5
        }, {
            y1: 0.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall14_5",
                    us: 0.5,
                    vs: 0.5,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: 0,
            x0: -5.25,
            x1: -5
        }],
        floor: [79, 27, 27],
        ceiling_height: 1,
        light: 0.8
    }, {
        floor_height: 0.4,
        ceiling: [119, 109, 99],
        edges: [{
            y1: -4,
            dest: 6,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -0.5,
            x1: -1.75
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -0.5,
            x1: -0.5
        }, {
            y1: -4.25,
            dest: 34,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -1.75,
            x1: -0.5
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -1.75,
            x1: -1.75
        }],
        floor: [119, 109, 99],
        ceiling_height: 0.7,
        light: 1
    }, {
        floor_height: 0.4,
        ceiling: [119, 109, 99],
        edges: [{
            y1: -4,
            dest: 7,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 1.75,
            x1: 0.5
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 1.75,
            x1: 1.75
        }, {
            y1: -4.25,
            dest: 34,
            tex: {
                l: {
                    u: 0,
                    n: "tp2_1",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 0.5,
            x1: 1.75
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 0.5,
            x1: 0.5
        }],
        floor: [119, 109, 99],
        ceiling_height: 0.7,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -4,
            dest: 3,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: 0.25,
            x1: -0.25
        }, {
            y1: -4,
            dest: 0,
            tex: {
                l: {
                    u: 0.16,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.1875,
            x0: 0.25,
            x1: 0.25
        }, {
            y1: -4.1875,
            dest: 37,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.1875,
            x0: -0.25,
            x1: 0.25
        }, {
            y1: -4.1875,
            dest: 0,
            tex: {
                l: {
                    u: -0.12,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4,
            x0: -0.25,
            x1: -0.25
        }],
        floor: [110, 90, 80],
        ceiling_height: 0,
        light: 1,
        tags: [{
            top: 1,
            type: "vertical door",
            bottom: 0
        }]
    }, {
        floor_height: 0,
        ceiling: [160, 195, 246],
        edges: [{
            y1: -4.25,
            dest: 37,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0.86,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 0.25,
            x1: -0.25
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.74,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 0.5,
            x1: 0.25
        }, {
            y1: -4.25,
            dest: 32,
            tex: {
                l: {
                    u: 0.12,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0.12,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 1.75,
            x1: 0.5
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 4,
            x1: 1.75
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 4,
            x1: 4
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 3.5,
            x1: 4
        }, {
            y1: -10.75,
            dest: 39,
            tex: {
                l: {
                    u: 0.46,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0.46,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 1.5,
            x1: 3.5
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 1,
            x1: 1.5
        }, {
            y1: -10.75,
            dest: 36,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0.22,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -1,
            x1: 1
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -1.5,
            x1: -1
        }, {
            y1: -10.75,
            dest: 35,
            tex: {
                l: {
                    u: 0.1,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0.1,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -3.5,
            x1: -1.5
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -4,
            x1: -3.5
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: -0.25,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -4,
            x1: -4
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -1.75,
            x1: -4
        }, {
            y1: -4.25,
            dest: 31,
            tex: {
                l: {
                    u: 0.24,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0.24,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 2,
                    vs: 2,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -0.5,
            x1: -1.75
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: 0.11,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -0.25,
            x1: -0.5
        }],
        floor: [130, 100, 70],
        ceiling_height: 4,
        light: 1
    }, {
        floor_height: 2,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -10.75,
            dest: 34,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -1.5,
            x1: -3.5
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -11,
            x0: -1.5,
            x1: -1.5
        }, {
            y1: -11,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "firefox",
                    us: 2,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -11,
            x0: -3.5,
            x1: -1.5
        }, {
            y1: -11,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -3.5,
            x1: -3.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 3,
        light: 1
    }, {
        floor_height: 2,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -10.75,
            dest: 34,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 1,
            x1: -1
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -11,
            x0: 1,
            x1: 1
        }, {
            y1: -11,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "opera",
                    us: 2,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -11,
            x0: -1,
            x1: 1
        }, {
            y1: -11,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: -1,
            x1: -1
        }],
        floor: [79, 27, 27],
        ceiling_height: 3,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -4.1875,
            dest: 33,
            tex: {
                l: {
                    u: 0,
                    n: "door15_4",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 0.5,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.1875,
            x0: 0.25,
            x1: -0.25
        }, {
            y1: -4.1875,
            dest: 0,
            tex: {
                l: {
                    u: 0.125,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: 0.25,
            x1: 0.25
        }, {
            y1: -4.25,
            dest: 34,
            tex: {
                l: {
                    u: 0,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.25,
            x0: -0.25,
            x1: 0.25
        }, {
            y1: -4.25,
            dest: 0,
            tex: {
                l: {
                    u: -0.03,
                    n: "2_conc_celing01",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -4.1875,
            x0: -0.25,
            x1: -0.25
        }],
        floor: [130, 100, 70],
        ceiling_height: 1,
        light: 1
    }, {
        floor_height: 0,
        ceiling: [160, 195, 246],
        edges: [{
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 4,
            x1: 1
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 1,
            x1: 4
        }],
        floor: [130, 100, 70],
        ceiling_height: 4,
        light: 1
    }, {
        floor_height: 2,
        ceiling: [79, 59, 43],
        edges: [{
            y1: -10.75,
            dest: 34,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 3.5,
            x1: 1.5
        }, {
            y1: -10.75,
            dest: 0,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -11,
            x0: 3.5,
            x1: 3.5
        }, {
            y1: -11,
            dest: 0,
            tex: {
                l: {
                    u: 0,
                    n: "safari",
                    us: 2,
                    vs: 1,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -11,
            x0: 1.5,
            x1: 3.5
        }, {
            y1: -11,
            dest: 0,
            tex: {
                l: {
                    u: 0.22,
                    n: "wall52_2",
                    us: 2,
                    vs: 2,
                    v: 0
                },
                u: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                },
                m: {
                    u: 0,
                    n: "",
                    us: 1,
                    vs: 1,
                    v: 0
                }
            },
            y0: -10.75,
            x0: 1.5,
            x1: 1.5
        }],
        floor: [79, 27, 27],
        ceiling_height: 3,
        light: 1
    }]
};
var ui_enabled = true;
(function () {
    var ui_doc;

    function init() {}

    function find_ui_doc() {
        if (!ui_doc) {
            var ui = $('uibottom');
            if (ui) {
                ui_doc = ui.contentDocument;
            }
        }
    }

    function set_counter(value) {
        try {
            find_ui_doc();
            if (ui_doc) {
                ui_doc.getElementById('counter_0').setAttribute('transform', 'translate(0, ' + (-80 * Math.floor(value / 10)) + ')');
                ui_doc.getElementById('counter_1').setAttribute('transform', 'translate(0, ' + (-80 * Math.floor(value % 10)) + ')');
                ui_doc.documentElement.forceRedraw();
            }
        } catch (e) {}
    }
    this.ui = {
        init: init,
        set_counter: set_counter
    };
})();
(function () {
    const max_vertical_look = 0.8;
    var editor_enabled = this.editor_enabled;
    var ui_enabled = this.ui_enabled;
    var fpsgraph_enabled = false;
    var camera = {
        x: 0,
        y: 0,
        z: 0,
        dx: 0,
        dy: 0,
        dh: 0,
        s: null,
        t: 0
    };
    var textures = {
        wall: {},
        sprite: {}
    };
    var loading_textures = [];
    var default_texture = {
        img: new Image(),
        w: 32,
        h: 32
    };
    var error_texture = {
        img: new Image(),
        w: 32,
        h: 32
    };
    default_texture.img.src = 'data:image/png;base64,' + texture_data.loading;
    error_texture.img.src = 'data:image/png;base64,' + texture_data.error;
    var level_data = {};

    function load_texture(type, name) {
        if (!name) {
            return undefined;
        }
        if (!textures.wall[name]) {
            var texture_dir = 'textures/tiled/' + ((options_flags.draw_pattern_walls || type == 'floor') ? 'mip2/' : 'mip/');
            textures.wall[name] = [];
            if (mipmap_enabled) {
                for (var i = mipmap_min; i <= mipmap_max; ++i) {
                    var image = new Image();
                    image.src = texture_dir + name + '.' + i + '.png';
                    textures.wall[name][i] = {
                        img: default_texture.img,
                        w: default_texture.w,
                        h: default_texture.h
                    };
                    loading_textures.push({
                        type: type,
                        obj: textures.wall[name][i],
                        img: image
                    });
                }
            } else {
                var image = new Image();
                image.src = texture_dir + name + '.' + mipmap_max + '.png';
                textures.wall[name][mipmap_min] = {
                    img: default_texture.img,
                    w: default_texture.w,
                    h: default_texture.h
                };
                loading_textures.push({
                    type: type,
                    obj: textures.wall[name][mipmap_min],
                    img: image
                });
            }
        }
        return textures.wall[name];
    }

    function load_sprite(name) {
        if (!textures.sprite[name]) {
            if (!spritedefs[name]) {
                return null;
            }
            textures.sprite[name] = {
                sprite: spritedefs[name],
                images: []
            };
            var i = 0;
            for (var a = 0; a < spritedefs[name].angles; ++a) {
                for (var f = 0; f < spritedefs[name].frames; ++f) {
                    textures.sprite[name].images.push({
                        img: default_texture.img,
                        w: default_texture.w,
                        h: default_texture.h
                    });
                    var image = new Image();
                    image.src = 'textures/sprites/' + spritedefs[name].img + '.' + a + '.' + f + '.png';
                    loading_textures.push({
                        type: 'sprite',
                        obj: textures.sprite[name].images[i],
                        img: image
                    });
                    ++i;
                }
            }
        }
        return textures.sprite[name];
    }

    function flush_textures() {
        textures = {
            wall: {},
            sprite: {}
        };
        loading_textures = [];
    }

    function process_pending_textures(ctx) {
        for (var t in loading_textures) {
            var tex = loading_textures[t];
            if (tex.img.complete) {
                if (tex.img.width) {
                    if (options_flags.draw_pattern_walls && tex.type == 'wall') {
                        tex.obj.img = ctx.createPattern(tex.img, 'repeat');
                        tex.obj.w = tex.img.width;
                        tex.obj.h = tex.img.height;
                    } else {
                        if (tex.type == 'floor') {
                            tex.obj.img = ctx.createPattern(tex.img, 'repeat');
                        } else if (options_flags.draw_from_canvas) {
                            var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
                            canvas.width = tex.img.width;
                            canvas.height = tex.img.height;
                            canvas.getContext('2d').drawImage(tex.img, 0, 0);
                            tex.obj.img = canvas;
                        } else {
                            tex.obj.img = tex.img;
                        }
                        if (tex.type == 'wall') {
                            tex.obj.w = tex.img.width / texture_u_repeat;
                            tex.obj.h = tex.img.height / texture_v_repeat;
                        } else {
                            tex.obj.w = tex.img.width;
                            tex.obj.h = tex.img.height;
                        }
                    }
                } else {
                    tex.obj.img = error_texture.img;
                    tex.obj.w = error_texture.w;
                    tex.obj.h = error_texture.h;
                }
                delete loading_textures[t];
            }
        }
    }

    function array_to_rgba(c) {
        return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',1)';
    }

    function colour_interpolate(c0, c1, n) {
        var m = 1 - n;
        return [Math.floor(c0[0] * m + c1[0] * n), Math.floor(c0[1] * m + c1[1] * n), Math.floor(c0[2] * m + c1[2] * n)];
    }

    function scripted_vertical_door(sector) {
        var attached_edges = [];
        for (var e = 0; e < sector.edges.length; ++e) {
            if (sector.edges[e].dest) {
                var edges2 = sector.edges[e].dest.edges;
                for (var e2 = 0; e2 < edges2.length; ++e2) {
                    if (edges2[e2].dest === sector) {
                        attached_edges.push(edges2[e2]);
                    }
                }
            }
        }
        return function (dt, dist) {
            var speed = 0.3;
            var h;
            if (dist < 2) {
                h = Math.min(1, sector.ceiling_height + speed * dt);
            } else {
                h = Math.max(0, sector.ceiling_height - speed * dt);
            }
            if (h != sector.ceiling_height) {
                for (var e = 0; e < attached_edges.length; ++e) {
                    attached_edges[e].upper.v = h * attached_edges[e].upper.vscale;
                }
                sector.ceiling_height = h;
            }
        };
    }

    function preprocess_map(ctx, h) {
        if (player.s) {
            player.sector_id = player.s.id;
        }
        sectors = [];
        level_data.proximity_triggers = [];
        for (var s = 0; s < level.sectors.length; ++s) {
            var sector = level.sectors[s];
            var new_sector = {
                id: s,
                floor_height: sector.floor_height,
                ceiling_height: sector.ceiling_height,
                light: sector.light,
                sector_id: s,
                sprites: {}
            };
            if (options_flags.gradient_surfaces) {
                var gradient;
                var dh = h * max_vertical_look;
                var stop0 = dh / (h + 2 * dh);
                var stop1 = (dh + h) / (h + 2 * dh);
                if (!options_flags.textured_floors) {
                    gradient = ctx.createLinearGradient(0, -dh, 0, h + dh);
                    var c = colour_interpolate([0, 0, 0], sector.floor, sector.light);
                    var c0 = array_to_rgba(colour_interpolate(c, [255, 255, 255], 0.3));
                    var c1 = array_to_rgba(c);
                    gradient.addColorStop(1, c0);
                    gradient.addColorStop(stop1, c0);
                    gradient.addColorStop(0.5, c1);
                    gradient.addColorStop(stop0, c1);
                    gradient.addColorStop(0, c1);
                    new_sector.floor = gradient;
                } else {
                    new_sector.floor = load_texture('floor', 'testfloor');
                }
                gradient = ctx.createLinearGradient(0, -dh, 0, h + dh);
                c = colour_interpolate([0, 0, 0], sector.ceiling, sector.light);
                c0 = array_to_rgba(colour_interpolate(c, [0, 0, 0], 0.3));
                c1 = array_to_rgba(c);
                gradient.addColorStop(0, c0);
                gradient.addColorStop(stop0, c0);
                gradient.addColorStop(0.5, c1);
                gradient.addColorStop(stop1, c1);
                gradient.addColorStop(1, c1);
                new_sector.ceiling = gradient;
            } else {
                c = colour_interpolate([0, 0, 0], sector.floor, sector.light);
                new_sector.floor = array_to_rgba(colour_interpolate(c, [255, 255, 255], 0.3 / 2));
                c = colour_interpolate([0, 0, 0], sector.ceiling, sector.light);
                new_sector.ceiling = array_to_rgba(colour_interpolate(c, [0, 0, 0], 0.3 / 2));
            }
            new_sector.edges = [];
            for (var e = 0; e < sector.edges.length; ++e) {
                var edge = sector.edges[e];
                var new_edge = {
                    x0: edge.x0,
                    y0: edge.y0,
                    x1: edge.x1,
                    y1: edge.y1,
                    dest: edge.dest,
                    dbg: edge.dbg
                };
                new_edge.len = point_distance(new_edge.x0, new_edge.y0, new_edge.x1, new_edge.y1);
                new_edge.lower = {
                    u: edge.tex.l.u,
                    v: edge.tex.l.v,
                    uscale: 1 / edge.tex.l.us,
                    vscale: 1 / edge.tex.l.vs,
                    tex: load_texture('wall', edge.tex.l.n)
                };
                new_edge.middle = {
                    u: edge.tex.m.u,
                    v: edge.tex.m.v,
                    uscale: 1 / edge.tex.m.us,
                    vscale: 1 / edge.tex.m.vs,
                    tex: load_texture('wall', edge.tex.m.n)
                };
                new_edge.upper = {
                    u: edge.tex.u.u,
                    v: edge.tex.u.v,
                    uscale: 1 / edge.tex.u.us,
                    vscale: 1 / edge.tex.u.vs,
                    tex: load_texture('wall', edge.tex.u.n || edge.tex.l.n)
                };
                new_sector.edges.push(new_edge);
            }
            for (e = 0; e < new_sector.edges.length; ++e) {
                new_sector.edges[e].next = new_sector.edges[(new_sector.edges.length + e - 1) % new_sector.edges.length];
            }
            sectors.push(new_sector);
        }
        for (var s = 0; s < sectors.length; ++s) {
            for (var e = 0; e < sectors[s].edges.length; ++e) {
                var edge = sectors[s].edges[e];
                edge.dest = (edge.dest === 0 ? null : sectors[edge.dest - 1]);
            }
        }
        player.s = sectors[player.sector_id];
        for (var s = 0; s < level.sectors.length; ++s) {
            if (level.sectors[s].tags) {
                for (var t = 0; t < level.sectors[s].tags.length; ++t) {
                    var tag = level.sectors[s].tags[t];
                    if (tag.type == 'vertical door') {
                        var c = polygon_centre(sectors[s]);
                        level_data.proximity_triggers.push({
                            x: c.x,
                            y: c.y,
                            fn: scripted_vertical_door(sectors[s])
                        });
                    } else {
                        alert('invalid sector tag "' + tag.type + '"');
                    }
                }
            }
        }
        sprites = [];
        for (var s = 0; s < level.sprites.length; ++s) {
            var new_sprite = {
                x: level.sprites[s].x,
                y: level.sprites[s].y,
                a: level.sprites[s].a
            };
            new_sprite.spritedef = load_sprite(level.sprites[s].sprite);
            new_sprite.sector = sectors[level.sprites[s].sector];
            new_sprite.z = level.sprites[s].z + new_sprite.sector.floor_height;
            var r = new_sprite.spritedef.sprite.radius;
            var nearby_sectors = find_nearby_sectors(new_sprite.x, new_sprite.y, new_sprite.sector, r);
            for (var i = 0; i < nearby_sectors.length; ++i) {
                nearby_sectors[i].sprites[s] = 1;
            }
            sprites.push(new_sprite);
        }
    }

    function find_nearby_sectors_(x, y, sector, d, found) {
        if (found[sector.id]) {
            return;
        }
        found[sector.id] = true;
        for (var e = 0; e < sector.edges.length; ++e) {
            var edge = sector.edges[e];
            if (edge.dest) {
                var dist = point_line_distance_circle(x, y, edge.x0, edge.y0, edge.x1, edge.y1);
                if (dist <= d) {
                    find_nearby_sectors_(x, y, edge.dest, d, found);
                }
            }
        }
    }

    function find_nearby_sectors(x, y, sector, d) {
        var found = {};
        find_nearby_sectors_(x, y, sector, d, found);
        var found_sectors = [];
        for (var s in found) {
            found_sectors.push(sectors[s]);
        }
        return found_sectors;
    }

    function move_camera_by(dx, dy, t) {
        var radius = player.radius;
        var d = Math.sqrt(dx * dx + dy * dy);
        var nearby_sectors = find_nearby_sectors(player.x, player.y, player.s, d + radius);
        for (var s = 0; s < nearby_sectors.length; ++s) {
            for (var e = 0; e < nearby_sectors[s].edges.length; ++e) {
                var edge = nearby_sectors[s].edges[e];
                if (edge.dest && (player.z + player.maxstep >= edge.dest.floor_height && player.z + player.height <= edge.dest.ceiling_height)) {} else {
                    var dir = dx * (edge.y1 - edge.y0) - dy * (edge.x1 - edge.x0);
                    if (dir > 0) {
                        var dist = point_line_distance_circle(player.x + dx, player.y + dy, edge.x0, edge.y0, edge.x1, edge.y1);
                        if (dist < radius) {
                            var d = radius - dist;
                            var nx = edge.y0 - edge.y1;
                            var ny = edge.x1 - edge.x0;
                            var n = d / Math.sqrt(nx * nx + ny * ny);
                            dx += nx * n;
                            dy += ny * n;
                        }
                    }
                }
            }
        }
        player.x += dx;
        player.y += dy;
        var new_sectors;
        for (var s = 0; s < nearby_sectors.length; ++s) {
            if (point_is_in_polygon(player.x, player.y, nearby_sectors[s])) {
                player.s = nearby_sectors[s];
                break;
            }
        }
    }

    function rotate_camera(da) {
        var a = Math.atan2(player.dx, player.dy);
        a -= da;
        player.dx = Math.sin(a);
        player.dy = Math.cos(a);
    }

    function move_camera(dx, dy) {
        var d = Math.sqrt(dx * dx + dy * dy);
        dx /= d;
        dy /= d;
        var step_size = player.radius / 2;
        while (d >= step_size) {
            move_camera_by(dx * step_size, dy * step_size, 1);
            d -= step_size;
        }
        if (d > 0) {
            move_camera_by(dx * d, dy * d, 1);
        }
    }

    function walk_camera(forwards, sideways) {
        var dx = player.dx * forwards - player.dy * sideways;
        var dy = player.dy * forwards + player.dx * sideways;
        move_camera(dx, dy);
    }

    function jump() {
        if (player.on_floor) {
            player.vz = 2;
        }
    }

    function process_input(keys, dt) {
        var walk_speed = 1.5;
        var strafe_speed = walk_speed / 2;
        var turn_speed = 1;
        var look_speed = 1;
        if (keys[DOM_VK.LEFT]) {
            rotate_camera(-turn_speed * dt);
        }
        if (keys[DOM_VK.RIGHT]) {
            rotate_camera(turn_speed * dt);
        }
        var dx = 0,
            dy = 0;
        if (keys[DOM_VK.UP]) {
            dx += walk_speed;
        }
        if (keys[DOM_VK.DOWN]) {
            dx -= walk_speed;
        }
        if (keys[DOM_VK.COMMA] || keys[DOM_VK.PRINTSCREEN] || keys[DOM_VK.X]) {
            dy -= strafe_speed;
        }
        if (keys[DOM_VK.PERIOD] || keys[DOM_VK.DELETE] || keys[DOM_VK.C]) {
            dy += strafe_speed;
        }
        if (dx || dy) {
            var d = Math.sqrt(dx * dx + dy * dy);
            dx /= d;
            dy /= d;
            walk_camera(dx * walk_speed * dt, dy * walk_speed * dt);
        }
        if (keys[DOM_VK.PAGE_UP]) {
            player.dh = Math.min(+max_vertical_look, player.dh + look_speed * dt);
        }
        if (keys[DOM_VK.PAGE_DOWN]) {
            player.dh = Math.max(-max_vertical_look, player.dh - look_speed * dt);
        }
        if (keys[DOM_VK.SPACE]) {
            jump();
        }
    }

    function do_gravity(dt) {
        var gravity_accel = 5;
        var max_floor = -Infinity,
            min_ceiling = Infinity;
        var r = player.radius - 0.01;
        var nearby_sectors = find_nearby_sectors(player.x, player.y, player.s, r);
        for (var s = 0; s < nearby_sectors.length; ++s) {
            max_floor = Math.max(nearby_sectors[s].floor_height, max_floor);
            min_ceiling = Math.min(nearby_sectors[s].ceiling_height, min_ceiling);
        }
        if (player.z == max_floor && player.vz <= 0) {
            player.vz = 0;
            player.on_floor = true;
        } else {
            player.vz -= gravity_accel * dt;
            player.on_floor = false;
            if (player.vz > 0) {
                if (player.z + player.vz * dt + player.height <= min_ceiling) {
                    player.z += player.vz * dt;
                } else {
                    player.z = min_ceiling - player.height;
                    player.vz = 0;
                }
            } else if (player.vz < 0) {
                if (player.z + player.vz * dt >= max_floor) {
                    player.z += player.vz * dt;
                } else {
                    player.z = max_floor;
                    player.vz = 0;
                    player.on_floor = true;
                }
            }
        }
    }

    function process_scripts(dt) {
        for (var i = 0; i < level_data.proximity_triggers.length; ++i) {
            var trigger = level_data.proximity_triggers[i];
            var dist = point_distance(trigger.x, trigger.y, player.x, player.y);
            trigger.fn(dt, dist);
        }
    }

    function draw_map(ctx) {
        ctx.fillStyle = '#fffff0';
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        ctx.fillRect((-map_shift_x - w / 2) / map_scale, (-map_shift_y - h / 2) / map_scale, w / map_scale, h / map_scale);
        var d = '';
        for (var s = 0; s < sectors.length; ++s) {
            var sector = sectors[s];
            for (var e = 0; e < sector.edges.length; ++e) {
                var edge = sector.edges[e];
                if (sector == camera.s) {
                    ctx.strokeStyle = '#0000ff';
                } else if (edge.dest === null) {
                    ctx.strokeStyle = '#00ff00';
                } else {
                    ctx.strokeStyle = '#ff0000';
                }
                ctx.beginPath();
                ctx.moveTo(edge.x0, edge.y0);
                ctx.lineTo(edge.x1, edge.y1);
                ctx.stroke();
            }
        }
        ctx.strokeStyle = '#ff00ff';
        ctx.beginPath();
        ctx.moveTo(camera.x, camera.y);
        ctx.lineTo(camera.x + camera.dx * 0.2, camera.y + camera.dy * 0.2);
        ctx.stroke();
        ctx.closePath();
    }

    function fpsgraph_enable(state) {
        if (!fpsgraph_enabled) {
            var obj = document.createElementNS('http://www.w3.org/1999/xhtml', 'object');
            obj.width = 640;
            obj.height = 320;
            obj.data = 'fpsgraph/fpsgraph.xhtml';
            obj.id = 'fpsgraph';
            $('fpsgraph_container').appendChild(obj);
            $('fpsgraph_container').style.display = 'block';
            fpsgraph_enabled = true;
        }
    }
    const STATE_LOADING = 0;
    const STATE_PLAYING = 1;
    var game_state = STATE_LOADING;

    function game_tick(ctx, dctx, gctx, w, h, keys, dt) {
        switch (game_state) {
        case STATE_LOADING:
            break;
        case STATE_PLAYING:
            process_input(keys, dt);
            do_gravity(dt);
            process_scripts(dt);
            camera.x = player.x;
            camera.y = player.y;
            camera.z = player.z + player.eyeline;
            camera.dx = player.dx;
            camera.dy = player.dy;
            camera.dh = player.dh;
            camera.s = player.s;
            camera.t += dt;
            if (dctx) {
                profile_begin('map');
                draw_map(dctx);
                profile_end('map');
            }
            process_pending_textures(ctx);
            render_frame(ctx, dctx, gctx, w, h, camera);
            break;
        }
    }

    function on_map_loaded(ctx, h) {
        preprocess_map(ctx, h);
        if (editor_enabled) {
            var reload_map = function () {
                    preprocess_map(ctx, h);
                };
            editor_init(reload_map);
        }
        game_state = STATE_PLAYING;
    }
    window.addEventListener('load', function () {
        profiler_enabled = ($('profile') !== null);
        var screen_ctx = $('c').getContext('2d');
        var w = $('c').width;
        var h = $('c').height;
        var render_ctx, render_canvas;
        if (options_flags.double_buffer) {
            render_canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            render_canvas.width = w;
            render_canvas.height = h;
            render_ctx = render_canvas.getContext('2d');
        } else {
            render_ctx = screen_ctx;
        }
        if (options_flags.opera_context) {
            try {
                var gctx = $('c').getContext('opera-2dgame');
                if (gctx) {
                    gctx.lockCanvasUpdates(true);
                }
            } catch (e) {}
        }
        var dctx;
        if (options_flags.map && $('dc')) {
            dctx = $('dc').getContext('2d');
            dctx.lineWidth = 1 / map_scale;
            dctx.translate(map_shift_x + dctx.canvas.width / 2, map_shift_y + dctx.canvas.height / 2);
            dctx.scale(map_scale, map_scale);
        }
        window.change_res = function (new_w, new_h, ui_class) {
            w = new_w;
            h = new_h;
            if (render_ctx != screen_ctx) {
                render_canvas.width = w;
                render_canvas.height = h;
            }
            $('c').width = w;
            $('c').height = h;
            $('ui').setAttribute('class', ui_class);
            preprocess_map(render_ctx, h);
        };
        var last_frame_time = null;

        function tick() {
            try {
                var now = new Date();
                var dt = Math.max(0, now - (last_frame_time || now)) / 1000;
                last_frame_time = now;
                game_tick(render_ctx, dctx, gctx, w, h, keys, dt);
                if (render_ctx !== screen_ctx) {
                    screen_ctx.drawImage(render_canvas, 0, 0);
                }
                profile_report();
                framerate_update();
            } catch (e) {
                debug(e);
            }
        }
        var paused = true;
        var frame_interval;

        function toggle_paused() {
            paused = !paused;
            if (paused) {
                render_paused(screen_ctx, w, h);
                clearInterval(frame_interval);
                last_frame_time = null;
            } else {
                frame_interval = setInterval(tick, editor_enabled ? 100 : 0);
            }
        }
        $('pause').onclick = toggle_paused;
        if (dctx) {
            $('dc').onmousemove = function (e) {
                var x = e.clientX - this.offsetLeft;
                var y = e.clientY - this.offsetTop;
                x -= player.x * map_scale + map_shift_x + dctx.canvas.width / 2;
                y -= player.y * map_scale + map_shift_y + dctx.canvas.height / 2;
                var mag = Math.sqrt(x * x + y * y);
                x /= mag;
                y /= mag;
                player.dx = x;
                player.dy = y;
            };
            $('dc').onclick = function (e) {
                var x = e.clientX - this.offsetLeft;
                var y = e.clientY - this.offsetTop;
                move_camera((x - map_shift_x - dctx.canvas.width / 2) / map_scale - player.x, (y - map_shift_y - dctx.canvas.height / 2) / map_scale - player.y);
            };
        }
        var keys = {};
        document.addEventListener('keydown', function (e) {
            keys[e.keyCode] = true;
        }, false);
        document.addEventListener('keyup', function (e) {
            keys[e.keyCode] = false;
        }, false);
        document.addEventListener('keypress', function (e) {
            var handled = true;
            switch (e.keyCode) {
            case DOM_VK.LEFT:
            case DOM_VK.RIGHT:
            case DOM_VK.UP:
            case DOM_VK.DOWN:
            case DOM_VK.PAGE_UP:
            case DOM_VK.PAGE_DOWN:
            case DOM_VK.COMMA:
            case DOM_VK.PERIOD:
            case DOM_VK.DELETE:
                handled = false;
                e.preventDefault();
                break;
            case DOM_VK.PAUSE:
                toggle_paused();
                break;
            case DOM_VK.HOME:
            case DOM_VK.END:
                player.dh = 0;
                break;
            default:
                switch (e.which) {
                case 116:
                    if (e.ctrlKey) {
                        handled = false;
                    } else {
                        fpsgraph_enable(true);
                    }
                    break;
                case 32:
                case 44:
                case 46:
                case 120:
                case 99:
                    handled = false;
                    e.preventDefault();
                    break;
                default:
                    handled = false;
                    break;
                }
            }
            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
        if (level) {
            on_map_loaded(render_ctx, h);
        } else {
            load_from_file_store_async('map_test0', function (obj) {
                level = obj;
                on_map_loaded(render_ctx, h);
            });
        }
        if (ui_enabled) {
            try {
                ui.init();
            } catch (e) {
                alert('UI initialisation failure: ' + e);
            }
        }
        toggle_paused();
    }, false);
})();
