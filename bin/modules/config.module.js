"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConfig = void 0;
var fitbit_locale_config_interface_1 = require("../interfaces/fitbit-locale-config.interface");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var date_formats_enum_1 = require("../enums/date-formats.enum");
function GetConfig() {
    var cfgPath = path_1.default.join(process.cwd(), 'fitbitLocaleHelper.json');
    var userConfig = fs_1.default.existsSync(cfgPath) ? JSON.parse(fs_1.default.readFileSync(cfgPath, 'utf8')) : {};
    var locales = userConfig.locales ? verifyLocales(userConfig.locales) : Object.values(fitbit_locale_config_interface_1.SupportedLocale);
    var sectionsData = {};
    for (var _i = 0, _a = ['app', 'settings', 'companion']; _i < _a.length; _i++) {
        var sectionId = _a[_i];
        if (userConfig[sectionId]) {
            sectionsData[sectionId] = verifySection(sectionId, userConfig[sectionId]);
        }
    }
    return __assign({ localesFolder: userConfig.localesFolder || 'locales', locales: locales }, sectionsData);
}
exports.GetConfig = GetConfig;
function verifySection(sectionId, sectionData) {
    var cfg = {};
    if (sectionData.weekCfg) {
        var weekCfg = verifyWeek(sectionId, sectionData.weekCfg);
        if (weekCfg) {
            cfg['weekCfg'] = weekCfg;
        }
    }
    if (sectionData.monthCfg) {
        var monthCfg = verifyMonth(sectionId, sectionData.monthCfg);
        if (monthCfg) {
            cfg['monthCfg'] = monthCfg;
        }
    }
    return cfg;
}
function verifyWeek(sectionId, userCfg) {
    if (!userCfg.format || !Object.values(date_formats_enum_1.WeekFormat).includes(userCfg.format)) {
        console.log("Missing or wrong format in " + sectionId + ".weekCfg. Skipping...");
        return;
    }
    return __assign({ format: userCfg.format }, getPrefixes(userCfg, 'week_'));
}
function verifyMonth(sectionId, userCfg) {
    if (!userCfg.format || !Object.values(date_formats_enum_1.MonthFormat).includes(userCfg.format)) {
        console.log("Missing or wrong format in " + sectionId + ".monthCfg. Skipping...");
        return;
    }
    return __assign({ format: userCfg.format }, getPrefixes(userCfg, 'month_'));
}
function getPrefixes(userCfg, defaultPrefix) {
    if ((!userCfg.prefix && !userCfg.suffix)) {
        return { prefix: defaultPrefix };
    }
    var prefixes = {};
    if (userCfg.prefix) {
        prefixes['prefix'] = userCfg.prefix;
    }
    if (userCfg.suffix) {
        prefixes['suffix'] = userCfg.suffix;
    }
    return prefixes;
}
function verifyLocales(providedLocales) {
    return providedLocales.filter(function (localeId) {
        if (!fitbit_locale_config_interface_1.SupportedLocale[localeId]) {
            console.log("Unknown locale \"" + localeId + "\". Skipping...");
            return false;
        }
        return true;
    });
}