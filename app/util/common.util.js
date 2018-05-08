'use strict';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

const baseRgx = /(.*).(js)$/;
const commonUtil = {


    isEmty: (str)=> !str || str.length === 0,
    // recursively walk modules path and callback for each file
    walk: function walk(wpath, type, excludeDir, callback) {
        // slice type
        var stype = type.slice(-1) === 's' ? type.slice(0, -1) : type;
        var rgx = new RegExp('(.*)-' + stype + '.(js)$', 'i');
        if (!fs.existsSync(wpath)) return;
        fs.readdirSync(wpath).forEach(function(file) {
            var newPath = path.join(wpath, file);
            var stat = fs.statSync(newPath);
            if (stat.isFile() && (rgx.test(file) || (baseRgx.test(file)) && newPath.indexOf(type) >= 0)) {
                // if (!rgx.test(file)) console.log('  Consider updating filename:', newPath);
                callback(newPath);
            } else if (stat.isDirectory() && file !== excludeDir && ~newPath.indexOf(type)) {
                walk(newPath, type, excludeDir, callback);
            }
        });
    },

    allRoutes:function allRoutes() {

        console.log('routes are loading ...');
        let routePath = 'app/routes/**/*.routes.js';
        let version = '/api/v1';
        glob.sync(routePath).forEach(function(file) {
          require('../'+file)(app, version);
          console.log(file + ' is loaded');
        });
    }
}
export default commonUtil;
