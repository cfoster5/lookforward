// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import CategoryControlAndroid from './CategoryControl.android';
import * as android from './CategoryControl.android';
import CategoryControl from './CategoryControl.ios';
import * as ios from './CategoryControl.ios';

declare var _test: typeof ios;
declare var _test: typeof android;

declare var _testDefault: typeof CategoryControl;
declare var _testDefault: typeof CategoryControlAndroid;

export * from './CategoryControl.ios';
export default CategoryControl;