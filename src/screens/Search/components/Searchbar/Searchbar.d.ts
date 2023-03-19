// This file exists for two purposes:
// 1. Ensure that both ios and android files present identical types to importers.
// 2. Allow consumers to import the module as if typescript understood react-native suffixes.
import Searchbar from "./Searchbar";
import * as ios from "./Searchbar";
import SearchbarAndroid from "./Searchbar.android";
import * as android from "./Searchbar.android";

declare var _test: typeof ios;
declare var _test: typeof android;

declare var _testDefault: typeof Searchbar;
declare var _testDefault: typeof SearchbarAndroid;

export * from "./Searchbar";
export default Searchbar;
