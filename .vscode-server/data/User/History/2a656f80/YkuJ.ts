import SemVer = require('semver/classes/semver');
import semver = require('semver');

/**
 * v1 > v2
 */
declare function gt(v1: string | SemVer, v2: string | SemVer, optionsOrLoose?: boolean | semver.Options): boolean;

export = gt;