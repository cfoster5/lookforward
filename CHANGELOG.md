# Changelog

## [7.13.0](https://github.com/cfoster5/lookforward/compare/v7.12.2...v7.13.0) (2025-12-31)


### Features

* add search count tracking for review request ([7104ce4](https://github.com/cfoster5/lookforward/commit/7104ce4da9b871e21bcb4151080d3f99d3fc378f))
* update search bar placeholder text ([5215ff8](https://github.com/cfoster5/lookforward/commit/5215ff88f2a75fa7a9313423724d41704c2dc8c2))

## [7.12.2](https://github.com/cfoster5/lookforward/compare/v7.12.1...v7.12.2) (2025-12-20)


### Bug Fixes

* update widget font styles for improved readability ([53d0d59](https://github.com/cfoster5/lookforward/commit/53d0d59b565562389ef10ea1da334b5e7cd88d26))

## [7.12.1](https://github.com/cfoster5/lookforward/compare/v7.12.0...v7.12.1) (2025-12-20)


### Bug Fixes

* update widget design to use predefined font sizes ([b15aaf5](https://github.com/cfoster5/lookforward/commit/b15aaf5037b9c1a2edd973c8a3e8a8450209b2dd))

## [7.12.0](https://github.com/cfoster5/lookforward/compare/v7.11.0...v7.12.0) (2025-12-18)


### Features

* add upcoming countdowns widget ([40a08f1](https://github.com/cfoster5/lookforward/commit/40a08f116545d5d67dc2fd361e8ae936cd625e5f))

## [7.11.0](https://github.com/cfoster5/lookforward/compare/v7.10.0...v7.11.0) (2025-12-16)


### Features

* add support for movie region and language selection ([e0b46f2](https://github.com/cfoster5/lookforward/commit/e0b46f22700797bd19f1b268ed5e3cf330d8e82e))
* add support for Sign in with Apple ([6e0e3b3](https://github.com/cfoster5/lookforward/commit/6e0e3b3d5e3aa37393c546395d726a8b7997e481))


### Bug Fixes

* disable headerRightItems in SharedLayout for movie-discover ([bdec343](https://github.com/cfoster5/lookforward/commit/bdec343be4c2d4c4261377263bf863529c6387ae))

## [7.10.0](https://github.com/cfoster5/lookforward/compare/v7.9.0...v7.10.0) (2025-12-03)


### Features

* add status filter to countdown screen and add filtered empty state component ([f13ca6e](https://github.com/cfoster5/lookforward/commit/f13ca6eb05c0cc75b62b112937de4a778027c124))


### Bug Fixes

* update status filtering to treat movies and games without release dates as unreleased ([7bc1357](https://github.com/cfoster5/lookforward/commit/7bc135749173d20b96e47bb721fc7a23939c81d1))

## [7.9.0](https://github.com/cfoster5/lookforward/compare/v7.8.2...v7.9.0) (2025-12-02)


### Features

* add media type filter functionality to countdown screen ([79dbb77](https://github.com/cfoster5/lookforward/commit/79dbb777f6b27b217e97023a85a7ddc50f1e69f0))


### Bug Fixes

* update tmdb-ts package version and refactor related imports ([d99e2a1](https://github.com/cfoster5/lookforward/commit/d99e2a1ce52d160fb38b5bd804b76b02469ff08b))

## [7.8.2](https://github.com/cfoster5/lookforward/compare/v7.8.1...v7.8.2) (2025-11-30)


### Bug Fixes

* add transparent screen titles for proper back navigation ([c71fe16](https://github.com/cfoster5/lookforward/commit/c71fe1654e47b452009b0ee65f56f3b2cd2b2b84))
* update game screen header button icon based on sub status ([aaf8293](https://github.com/cfoster5/lookforward/commit/aaf8293aa01c90feedc3a41295b373cabe7cada5))

## [7.8.1](https://github.com/cfoster5/lookforward/compare/v7.8.0...v7.8.1) (2025-11-29)


### Bug Fixes

* prevent infinite loop in useAddRecent effect dependencies ([114ba83](https://github.com/cfoster5/lookforward/commit/114ba8395518ac3f5843fea1558eb525a004af8d))

## [7.8.0](https://github.com/cfoster5/lookforward/compare/v7.7.0...v7.8.0) (2025-11-29)


### Features

* implement handleMovieToggle for subscription management and Pro limit checks ([a38719f](https://github.com/cfoster5/lookforward/commit/a38719f805c265fb897d0a5fded5b8ef6c881ef4))


### Bug Fixes

* update header buttons to correct sizing issues ([55cc803](https://github.com/cfoster5/lookforward/commit/55cc8031063a7260a0b5b2b60c8b42f10c1c76ba))

## [7.7.0](https://github.com/cfoster5/lookforward/compare/v7.6.0...v7.7.0) (2025-11-29)


### Features

* update movie screen with Apple header options ([0bc3d9b](https://github.com/cfoster5/lookforward/commit/0bc3d9b85c26283b50da288de6325acc88bbf3ad))

## [7.6.0](https://github.com/cfoster5/lookforward/compare/v7.5.0...v7.6.0) (2025-11-23)


### Features

* adjust button placement in OnboardingModal to make Explore Pro Features more prominent ([5d325f1](https://github.com/cfoster5/lookforward/commit/5d325f1cc737b1494b331b8f8ba3d8d326a0af0d))

## [7.5.0](https://github.com/cfoster5/lookforward/compare/v7.4.0...v7.5.0) (2025-11-22)


### Features

* integrate RevenueCat for Pro and tip offerings ([865205c](https://github.com/cfoster5/lookforward/commit/865205ccd460139a1d38d5e269babf793adebbf6))

## [7.4.0](https://github.com/cfoster5/lookforward/compare/v7.3.2...v7.4.0) (2025-11-11)


### Features

* implement account creation, login, and password reset flows ([eefec9b](https://github.com/cfoster5/lookforward/commit/eefec9b381929887e70cba4abe99ee4455f958ed))
* implement anonymous sign-in for unauthenticated users ([f53f069](https://github.com/cfoster5/lookforward/commit/f53f06996f3a2e68649d9797b2d9ff0bcab5eb7e))


### Bug Fixes

* correct dependency array for adding recent items ([2435247](https://github.com/cfoster5/lookforward/commit/24352472a8fa24e5c7af4832c71cce1dc633112e))
* correct race condition when there is no user ([c020263](https://github.com/cfoster5/lookforward/commit/c020263b687274178ada7e94c28bde246730e266))
* corrects issue where app would open in Countdown tab ([241ffb3](https://github.com/cfoster5/lookforward/commit/241ffb39327296db2df0e2078fc02ff683685fc2))
* update query selection to retrieve available packages for tips ([12ef292](https://github.com/cfoster5/lookforward/commit/12ef292b1d968b39f62a2f28f0dc33f5dfa347a8))

## [7.3.2](https://github.com/cfoster5/lookforward/compare/v7.3.1...v7.3.2) (2025-11-09)


### Bug Fixes

* handle optional chaining for game cover URL in getImageSource function ([ab80541](https://github.com/cfoster5/lookforward/commit/ab80541de9af3457719768c1dfb96a186f5124af))

## [7.3.1](https://github.com/cfoster5/lookforward/compare/v7.3.0...v7.3.1) (2025-11-09)


### Bug Fixes

* request store review directly when subscribing instead of as a side effect ([3b77804](https://github.com/cfoster5/lookforward/commit/3b778046d7a15287fa9b9da45dbf015966aa57fd))

## [7.3.0](https://github.com/cfoster5/lookforward/compare/v7.2.0...v7.3.0) (2025-11-08)


### Features

* add countdown limit enforcement for free tier users ([8d13657](https://github.com/cfoster5/lookforward/commit/8d136575e29136ceb834260f67a5d6b771a707e9))
* enable subscription options in Pro modal ([853aa66](https://github.com/cfoster5/lookforward/commit/853aa66545eb7d6b43f7bdd1b648148c2f08c414))
* re-enable Pro feature promotion throughout app ([592bfe9](https://github.com/cfoster5/lookforward/commit/592bfe9c7f1ba50c4240f650b08393dec8fca904))


### Bug Fixes

* correct isPro store to default false and use setIsPro parameter ([84f565d](https://github.com/cfoster5/lookforward/commit/84f565d8eb12076cba3a0e85bdfe295c1a43e82e))

## [7.2.0](https://github.com/cfoster5/lookforward/compare/v7.1.3...v7.2.0) (2025-11-08)


### Features

* update Settings screens to use inset design ([840a664](https://github.com/cfoster5/lookforward/commit/840a664cf94621466a0721d294df0fcb95ef8697))

## [7.1.3](https://github.com/cfoster5/lookforward/compare/v7.1.2...v7.1.3) (2025-10-27)


### Bug Fixes

* correct query field from 'category' to 'game_type' in useHypedGames ([cc47d88](https://github.com/cfoster5/lookforward/commit/cc47d886aa83b7f23995fdf1859367e59167a9d6))

## [7.1.2](https://github.com/cfoster5/lookforward/compare/v7.1.1...v7.1.2) (2025-10-25)


### Bug Fixes

* update key for job filter button in Person screen to use credit.job ([f99d775](https://github.com/cfoster5/lookforward/commit/f99d775349ea5a7456969ffefa1b84ddb0aec5ab))

## [7.1.1](https://github.com/cfoster5/lookforward/compare/v7.1.0...v7.1.1) (2025-10-16)


### Bug Fixes

* correct infinite loop for useAddRecent that would cause the app to crash; fixes [#155](https://github.com/cfoster5/lookforward/issues/155) ([6d88982](https://github.com/cfoster5/lookforward/commit/6d8898283294f68c3494ec93f0b42970a38857d6))

## [7.1.0](https://github.com/cfoster5/lookforward/compare/v7.0.1...v7.1.0) (2025-10-11)


### Features

* add platform-specific tab icons ([0e181ca](https://github.com/cfoster5/lookforward/commit/0e181ca39edb6b2737de26f740390b70f0c828d6))


### Bug Fixes

* update countdown items to show "TBD days" instead of "∞ days" ([4d03915](https://github.com/cfoster5/lookforward/commit/4d039155d6c90354a2649e72843f00eb69bc9058))

## [7.0.1](https://github.com/cfoster5/lookforward/compare/v7.0.0...v7.0.1) (2025-10-04)


### Bug Fixes

* correct jumpy CategoryControl on Home screen ([d93788f](https://github.com/cfoster5/lookforward/commit/d93788fa371b1a2848687f562b03ce747108b0b9))

## [7.0.0](https://github.com/cfoster5/lookforward/compare/v6.18.0...v7.0.0) (2025-10-02)


### ⚠ BREAKING CHANGES

* migrate to expo-router

### Features

* add IconSymbol component for consistent icon usage across platforms ([8cb3e36](https://github.com/cfoster5/lookforward/commit/8cb3e36268ebf85e187352db78718ffa89d1165c))
* adjust review request threshold from 5 to 3 subscriptions ([5586919](https://github.com/cfoster5/lookforward/commit/558691902447a1cb51fa9e3847d0dbe6b1ded117))
* enable pro features by default ([e9b1819](https://github.com/cfoster5/lookforward/commit/e9b1819c6b43d5a879ac9adb97de0141d4f147ea))
* migrate to expo-router ([a8b2fe0](https://github.com/cfoster5/lookforward/commit/a8b2fe0bf1d483bf3643d25c10ef4e51d4936cdc))
* remove Google Ads ([760c540](https://github.com/cfoster5/lookforward/commit/760c540286f12d2ce9ee4c1c272b1f801475f509))
* update Tabs to NativeTabs for Liquid Glass and universal search tab ([5d311ad](https://github.com/cfoster5/lookforward/commit/5d311ade057596fa73ea7673c169fa4f94c4bf29))


### Bug Fixes

* add color prop to header buttons in MovieScreen ([1bb4f5c](https://github.com/cfoster5/lookforward/commit/1bb4f5c2b6c7f586e6b419593b63adb26d8c9572))
* add color prop to share button in DynamicShareHeader ([2518db3](https://github.com/cfoster5/lookforward/commit/2518db38e85d385b0ec2b3038468b6baf28e4723))
* add Countdown header buttons ([8f89f87](https://github.com/cfoster5/lookforward/commit/8f89f87f1eb5581579023cde09aef2eb35cd0889))
* add keyboard dismissal when scrolling search results ([447b57a](https://github.com/cfoster5/lookforward/commit/447b57a70d39cbfd59624809dd194849bd93c139))
* adjust spacing and layout for movie posters in Person screen ([a790153](https://github.com/cfoster5/lookforward/commit/a79015392c74a6dd9555277f212564aba9f1a711))
* adjust spacing for movie posters in Collection component ([0f312cd](https://github.com/cfoster5/lookforward/commit/0f312cdc9526269af89f9075abad5fd5ca89f33e))
* adjust spacing for movie posters in MovieDiscover ([4399d18](https://github.com/cfoster5/lookforward/commit/4399d18421c140cae1c4a5afabcf4beb027c3fca))
* correct broken design of search results wrapped with ContextMenuLink ([674b483](https://github.com/cfoster5/lookforward/commit/674b483c22946ca01192345261ed55eb2b903e12))
* ensure id comparison in addRecent handles string to number conversion ([9f133a0](https://github.com/cfoster5/lookforward/commit/9f133a0eabac5a3c7fd8272e54b6e8b441d81f11))
* remove contentInset and scrollIndicatorInsets in MovieScreen ([cb186e7](https://github.com/cfoster5/lookforward/commit/cb186e73b18b1cccffa1514dfeabdfaf081bb662))
* remove contentInset in Countdown ([e7f46fe](https://github.com/cfoster5/lookforward/commit/e7f46fed21a721ee70fb188f0dabffe986b0df2f))
* show Search CategoryControl when history is empty ([9639ddb](https://github.com/cfoster5/lookforward/commit/9639ddb9073e6247667b8df5d64a280d531a3ced))
* update IGDB queries to use release_region instead of region which was deprecated ([d249608](https://github.com/cfoster5/lookforward/commit/d249608b9d4737238efbb7a8ab293f0eb4b4ed6f))
* update isPro to true at all times ([7ab5379](https://github.com/cfoster5/lookforward/commit/7ab53796c6fb99ad897578415d59e79341d86862))
* update movie search modal to use zustand store ([e37dfee](https://github.com/cfoster5/lookforward/commit/e37dfee401966141221702dd0d43264a4f842605))
* update Search CategoryControl to stick to top of screen ([4383821](https://github.com/cfoster5/lookforward/commit/43838219302dfff6fa5e1027fe1ebdd140b565cc))
* update title of search screen to "Recents" ([99cc6b4](https://github.com/cfoster5/lookforward/commit/99cc6b41e3487dcf032e67f89c97e387e321e8ec))


### Performance Improvements

* replace useEffect with useQuery for fetching tips ([7e6250f](https://github.com/cfoster5/lookforward/commit/7e6250f374075a8e0843e34205ce6ee7ade761bf))

## [6.18.0](https://github.com/cfoster5/lookforward/compare/v6.17.0...v6.18.0) (2025-04-30)


### Features

* add price and headline to top of Pro modal ([9d0f289](https://github.com/cfoster5/lookforward/commit/9d0f289d3c786b5111eb2dc970c1baf635395d0e))

## [6.17.0](https://github.com/cfoster5/lookforward/compare/v6.16.0...v6.17.0) (2025-04-29)


### Features

* add blurred preview of recent history for Pro ([98b7371](https://github.com/cfoster5/lookforward/commit/98b7371d9dd81605d103f2e7c1b7dd6a2b88628d))


### Bug Fixes

* update color prop to tintColor for SymbolView in Row component ([bf9a568](https://github.com/cfoster5/lookforward/commit/bf9a56850b466ec4de9c6836d72c3e95bdc9925e))

## [6.16.0](https://github.com/cfoster5/lookforward/compare/v6.15.2...v6.16.0) (2025-04-29)


### Features

* clarify purchase message to indicate lifetime access ([af0412f](https://github.com/cfoster5/lookforward/commit/af0412fb005cbe69d4868a7f1a090be1cfb1545b))

## [6.15.2](https://github.com/cfoster5/lookforward/compare/v6.15.1...v6.15.2) (2025-04-29)


### Bug Fixes

* correct regression from last update where discoverMovies params weren't being accounted for ([1921045](https://github.com/cfoster5/lookforward/commit/1921045a05bf9bfdf5d2a0c121dad932d62fa36a))

## [6.15.1](https://github.com/cfoster5/lookforward/compare/v6.15.0...v6.15.1) (2025-04-27)


### Bug Fixes

* correct extra spacing for recent movies SectionList between History and People labels ([d36e0f9](https://github.com/cfoster5/lookforward/commit/d36e0f90c518ca1ace86f619643e3ad9a711727a))
* correct onPress happening during or before onLongPress, ([03aad4b](https://github.com/cfoster5/lookforward/commit/03aad4bb7a64eca4d1755db5b77675b18e9523a1))

## [6.15.0](https://github.com/cfoster5/lookforward/compare/v6.14.0...v6.15.0) (2025-04-27)


### Features

* add context menu for MoviePoster and Person components ([554597a](https://github.com/cfoster5/lookforward/commit/554597abd5ed219f967d9b3c822754178d0c61f9))


### Bug Fixes

* correct recent items and people being clipped when they scaled up when opening the context menu ([948fa8d](https://github.com/cfoster5/lookforward/commit/948fa8d3febf5d36da99fe49e01c27304b9ee86a))

## [6.14.0](https://github.com/cfoster5/lookforward/compare/v6.13.0...v6.14.0) (2025-04-26)


### Features

* add analytics for sharing ([2185535](https://github.com/cfoster5/lookforward/commit/2185535267b109d081a538448879cdf256d4beef))
* enable React Native's new architecture ([#127](https://github.com/cfoster5/lookforward/issues/127)) ([e3f040e](https://github.com/cfoster5/lookforward/commit/e3f040ef2c346b53993f27d1709e7ab291703da3))

## [6.13.0](https://github.com/cfoster5/lookforward/compare/v6.12.0...v6.13.0) (2025-04-24)


### Features

* migrate to new image gallery for movies ([3f72fda](https://github.com/cfoster5/lookforward/commit/3f72fdaad7aed3a790c264250e84f19fe2247951))
* move trailer close button to left side of screen to match new image gallery ([e099868](https://github.com/cfoster5/lookforward/commit/e0998686a96971f0ae4a20a584de02c62f1f5f59))

## [6.12.0](https://github.com/cfoster5/lookforward/compare/v6.11.0...v6.12.0) (2025-04-23)


### Features

* integrate Google Mobile Ads SDK and add ad banners to various screens ([c06cea6](https://github.com/cfoster5/lookforward/commit/c06cea628c75a6bd68c67606fd967081ee79c1de))

## [6.11.0](https://github.com/cfoster5/lookforward/compare/v6.10.0...v6.11.0) (2025-04-22)


### Features

* Update link sharing for better sharing experience ([5fdf8e7](https://github.com/cfoster5/lookforward/commit/5fdf8e782ac3b77a764d3504cc1f324f3d3f7b56))

## [6.10.0](https://github.com/cfoster5/lookforward/compare/v6.9.1...v6.10.0) (2025-04-20)


### Features

* Add YouTube player directly within app for trailers ([13d482e](https://github.com/cfoster5/lookforward/commit/13d482e15a147b9209c28573c404f1e423476e73))


### Performance Improvements

* Optimize movie data fetching and filtering logic in getMovies and MovieLayout components ([b138d49](https://github.com/cfoster5/lookforward/commit/b138d49668f91a6f6cbb2da5986a9e8147302ea6))

## [6.9.1](https://github.com/cfoster5/lookforward/compare/v6.9.0...v6.9.1) (2025-04-08)


### Performance Improvements

* Prefetch subbed movie and game release details ([8ad79d7](https://github.com/cfoster5/lookforward/commit/8ad79d700299b2a365e354683b5588e683756562))

## [6.9.0](https://github.com/cfoster5/lookforward/compare/v6.8.0...v6.9.0) (2025-04-07)


### Features

* Add DropdownMenu and ApplePillButton to SearchBottomSheet to switch between movies and games ([629af02](https://github.com/cfoster5/lookforward/commit/629af02dd2ce5e686d4bcfe395b14bb72d1bad90))

## [6.8.0](https://github.com/cfoster5/lookforward/compare/v6.7.1...v6.8.0) (2025-03-23)


### Features

* Add ContextMenu for Countdown toggle and sharing movies from SearchBottomSheet ([13fb403](https://github.com/cfoster5/lookforward/commit/13fb4031d83c3988c1dfb3fdc7b03699eecf6318))
* Add ContextMenu for sharing and individually removing recent items; closes [#114](https://github.com/cfoster5/lookforward/issues/114) ([21ea1bf](https://github.com/cfoster5/lookforward/commit/21ea1bf76a528d56b534faf3c0289f12f3398507))
* Add ContextMenu for sharing people from SearchBottomSheet ([2d89828](https://github.com/cfoster5/lookforward/commit/2d8982896810d059f286da4dc12784c929b3c42f))
* Add countdown toggle for movies in RecentTitle component ([7e7845e](https://github.com/cfoster5/lookforward/commit/7e7845e152ab06474cb1420459663ffee70ac18d))


### Bug Fixes

* Update linking config to correct links not opening correctly ([1385437](https://github.com/cfoster5/lookforward/commit/138543732b12efaec91f2faaecd6ddf1de550a77))


### Performance Improvements

* Optimize movie watch providers filtering and sorting in MovieSearchModal ([917ee4b](https://github.com/cfoster5/lookforward/commit/917ee4bbddd44da14feba8fe3ab7d5b261324d1a))

## [6.7.1](https://github.com/cfoster5/lookforward/compare/v6.7.0...v6.7.1) (2025-03-19)


### Bug Fixes

* Update width calculation on posters by flooring element count to avoid fractional space ([4d6b1ab](https://github.com/cfoster5/lookforward/commit/4d6b1ab3dcbff37a10e9b9643d16949339b32759))

## [6.7.0](https://github.com/cfoster5/lookforward/compare/v6.6.0...v6.7.0) (2025-03-19)


### Features

* Add dropdown menu for cast/crew, trailers/teasers, & posters/backdrops selection for movies ([483c140](https://github.com/cfoster5/lookforward/commit/483c1408fe1770579b1b12de227808a0517e7cf5))

## [6.6.0](https://github.com/cfoster5/lookforward/compare/v6.5.0...v6.6.0) (2025-03-17)


### Features

* Add app review request prompt and add app config store; closes [#109](https://github.com/cfoster5/lookforward/issues/109) ([7fdd920](https://github.com/cfoster5/lookforward/commit/7fdd9201b25cb6b61e70118da8db699bd7dab5f7))
* Replace usage of useMMKVString with Zustand middleware for managing storage of recent items ([275a824](https://github.com/cfoster5/lookforward/commit/275a824a8631b202b3142ec22e921be01b59a9ac))
* Show onboarding modal if never tracked, even for logged in users; closes [#17](https://github.com/cfoster5/lookforward/issues/17) ([9b513b8](https://github.com/cfoster5/lookforward/commit/9b513b8693c63269a92049ab4ab4098f5672659d))


### Bug Fixes

* Add GamePlatformPicker component to Game screen; fixes [#38](https://github.com/cfoster5/lookforward/issues/38) ([00b3da4](https://github.com/cfoster5/lookforward/commit/00b3da421373b7f9ed8195e2caf15ff733150b57))

## [6.5.0](https://github.com/cfoster5/lookforward/compare/v6.4.1...v6.5.0) (2025-03-15)


### Features

* Enhance Pro features visibility in Movie screen ([e6548ad](https://github.com/cfoster5/lookforward/commit/e6548adc1e7f5314e4604b94c790bf7ff97afc2a))


### Bug Fixes

* Correct spacing above and below lists for movie and game search screens ([eadb114](https://github.com/cfoster5/lookforward/commit/eadb1144bff6b9e8c341876688f4f49ad1ffd6fe))

## [6.4.1](https://github.com/cfoster5/lookforward/compare/v6.4.0...v6.4.1) (2025-03-15)


### Bug Fixes

* Update poster dimensions and improve width calculation logic ([f6a1119](https://github.com/cfoster5/lookforward/commit/f6a1119327805ad9693f6f92fb1c2509be5ace92))

## [6.4.0](https://github.com/cfoster5/lookforward/compare/v6.3.1...v6.4.0) (2025-03-14)


### Features

* Bump Expo to 52 and bump [@react-native-firebase](https://github.com/react-native-firebase) ([b4841c7](https://github.com/cfoster5/lookforward/commit/b4841c7f7d9a9dadeb432082e51789cd9c16305f))


### Bug Fixes

* Handle undefined game or release dates in getGameReleaseDate function ([deb8b2a](https://github.com/cfoster5/lookforward/commit/deb8b2a721b4bbedd3721e466f7e9ee3b14e59f0))
* Implement useBottomTabOverflow hook to correct scroll bar running under tab bar ([0383bcf](https://github.com/cfoster5/lookforward/commit/0383bcfd92ca0d02427eb09fb40316bf3da58592))


### Performance Improvements

* Improve release date filtering logic in getGameReleaseDate function ([21ef30a](https://github.com/cfoster5/lookforward/commit/21ef30a5874368231b787c31d8c71b303eae2ab1))
* Optimize job credits aggregation in movie screen ([31ad808](https://github.com/cfoster5/lookforward/commit/31ad808073d16564a268ebed7e105107ecaf962e))

## [6.3.1](https://github.com/cfoster5/lookforward/compare/v6.3.0...v6.3.1) (2025-02-19)


### Bug Fixes

* Add name as param when logging select_promotion for analytics ([18a285d](https://github.com/cfoster5/lookforward/commit/18a285dfe21a1739d45ec69fe04e32708f2b16d9))

## [6.3.0](https://github.com/cfoster5/lookforward/compare/v6.2.6...v6.3.0) (2025-02-18)


### Features

* Add analytics and log Pro and tip jar views ([cb7ae8e](https://github.com/cfoster5/lookforward/commit/cb7ae8e62e04602d26eb6ef68ed5ec732c80eb30))
* Add clear methods for recents ([d6c37c3](https://github.com/cfoster5/lookforward/commit/d6c37c3a430529a1b321912d6f10f3f54477cc0a))
* Add game search to SearchBottomSheet ([5852dc4](https://github.com/cfoster5/lookforward/commit/5852dc4e4b6c468d17ca4c257d7cdcc1abcc5a1e))
* Add handleRestorePurchase ([362fe72](https://github.com/cfoster5/lookforward/commit/362fe72fe6d03368246929a3fb75a72870be12d8))
* Add icon button to change categoryIndex ([22bf540](https://github.com/cfoster5/lookforward/commit/22bf540e5b33b894959ac29cdc1a694b07e837ba))
* Add initials to SearchPerson with no image ([d63b8a3](https://github.com/cfoster5/lookforward/commit/d63b8a3de0b3f69f35f3733577aadf79c83851fd))
* Add known_for_department for SearchPerson ([365191f](https://github.com/cfoster5/lookforward/commit/365191fb0dfc769130917c6f336d34b7609ce4ac))
* Add movie search results ([593c90c](https://github.com/cfoster5/lookforward/commit/593c90c186d52362006e0f1c6cbdc2c5a075edd9))
* Add movies search to SearchBottomSheet ([b978bee](https://github.com/cfoster5/lookforward/commit/b978beea0989aa530faf2eb82c1e2e3b98963922))
* Add navigation chevron ([3452f0e](https://github.com/cfoster5/lookforward/commit/3452f0eef4c6a5f241fefdbecb6b0a01f18a44d9))
* Add navigation to SearchMovie ([b988af4](https://github.com/cfoster5/lookforward/commit/b988af47abcd94b5db56630f44d9d666af7d5c42))
* Add onboarding modal ([9dcaecd](https://github.com/cfoster5/lookforward/commit/9dcaecdaad694845761f062585709c6cc3b269ba))
* Add Pro unlock modal ([d4470fb](https://github.com/cfoster5/lookforward/commit/d4470fbe7a7e0fa7916f66e894fa48e1b6b41e26))
* Add release date to SearchGame ([bbb5f62](https://github.com/cfoster5/lookforward/commit/bbb5f62a9ccc0099eadb952d7ccf434a35e33837))
* Add release date to SearchMovie ([cf94e42](https://github.com/cfoster5/lookforward/commit/cf94e4241ac9559b5ba9695f4b48c392f3afa4bd))
* Add RN SFSymbols ([c7f55f1](https://github.com/cfoster5/lookforward/commit/c7f55f1cd3c2099321aef712e1213ca4b8c318f5))
* Add setting button to write review ([1158f71](https://github.com/cfoster5/lookforward/commit/1158f71ad15e67c69e0b5ffdf79c74481949fad6))
* Add settings buttons for onboarding and pro modals ([675e5c4](https://github.com/cfoster5/lookforward/commit/675e5c417481911eb0bf3185cdf27a6e8357f6cc))
* Add shouldShowTitle to control rendering ([bca600a](https://github.com/cfoster5/lookforward/commit/bca600a74fda3c6416e9cfbff0eb58d6a8565ec7))
* Add SubscriptionOption ([3273f59](https://github.com/cfoster5/lookforward/commit/3273f590f9601f3c59132dab9cb3a27b2c4c4bf5))
* Add terms of use and privacy policy buttons ([683424e](https://github.com/cfoster5/lookforward/commit/683424ee036d33f4d1fa80e03505407779f2518e))
* Add universal link sharing for movies, cast & crew, and collections ([1b50e6b](https://github.com/cfoster5/lookforward/commit/1b50e6be7a0700117687f67613a5e55d100a49f7))
* Bump RN to 0.72 and Expo to 49 w/ deps ([c400fa4](https://github.com/cfoster5/lookforward/commit/c400fa42a4470e32519187e772ffb721ef6937eb))
* Bump RN to 0.73 and Expo to 50 w/ deps ([ea7bdb1](https://github.com/cfoster5/lookforward/commit/ea7bdb14ced4f55ee085ed8418f2bb4cb55cd223))
* Create bottom sheet for searching ([9093e50](https://github.com/cfoster5/lookforward/commit/9093e50f63609ff0cdf4291ceef52e61c71944df))
* Create button to set notification permission ([430b325](https://github.com/cfoster5/lookforward/commit/430b325ceb4c8b3c63fd49afd674a7923306cfa8))
* Create methods to conditionally control rendering ([543178c](https://github.com/cfoster5/lookforward/commit/543178cf0a9801958bdcbcda3880feed970239f4))
* Create SearchGame ([b200db3](https://github.com/cfoster5/lookforward/commit/b200db334e6d39e04a11e0f5d529a14cf3256c6b))
* Display sub plans and set isPro after purchase ([27a1ae8](https://github.com/cfoster5/lookforward/commit/27a1ae810481d2973b111e2f413eb1fdbde9d9d5))
* Dynamically show pro content based on isPro ([3b92a18](https://github.com/cfoster5/lookforward/commit/3b92a18c1db17010b3f3263de44b58e8ccf7b178))
* Force dark mode ([4dda823](https://github.com/cfoster5/lookforward/commit/4dda8233bce2a4c15a222b2363b9353c701106bc))
* Group movie credits for crew ([ac89054](https://github.com/cfoster5/lookforward/commit/ac890545cee7a9a067524df0eff48f5b1fa4ec2c))
* Listen for changes to customerInfo ([7287d98](https://github.com/cfoster5/lookforward/commit/7287d9804be1e284ca2a5ec450858d58c6e740ef))
* Navigate to Actor from SearchPerson ([075219d](https://github.com/cfoster5/lookforward/commit/075219dec3cf2a2388a10c7010cebab32eed253f))
* Navigate to Game from Countdown ([b5763d1](https://github.com/cfoster5/lookforward/commit/b5763d14c8a19629a05c118046bc51adf19e7bf3))
* Rename RecentMovie to RecentTitle and add navigation for games ([d7d9456](https://github.com/cfoster5/lookforward/commit/d7d9456d385f2e336d9fde755e900da0713cad3a))
* Replace expo IAP methods for react-native-purchases ([26e3996](https://github.com/cfoster5/lookforward/commit/26e3996779ab884e2ded15a68475882e2f4312f2))
* Replace expo-in-app-purchases with react-native-purchases ([995a01f](https://github.com/cfoster5/lookforward/commit/995a01f19570b07a616f847d6c7db77e6b9a37fa))
* Replace multiple GamePlatformPicker with one BottomSheet ([d282ad3](https://github.com/cfoster5/lookforward/commit/d282ad3923a504c06a0a402e85ac75fb6666d612))
* Set image path conditionally for movie or game ([17eb1b2](https://github.com/cfoster5/lookforward/commit/17eb1b28bb8193d6de4791cc6b0a4a08abcea618))
* set isPro based on listener ([d1d0fde](https://github.com/cfoster5/lookforward/commit/d1d0fde055d199e4f4eb8522d6a44bfe8f47a98e))
* Show OMDB ratings and box office to pro users ([fb823bb](https://github.com/cfoster5/lookforward/commit/fb823bb2d3d83ebcfb11bd56b8128d6278f9d5fa))
* Store and get viewed games ([8798ef1](https://github.com/cfoster5/lookforward/commit/8798ef1907dd1301d22c2aa6aaee946db3abecc1))
* Store and get viewed movies and people ([5956c05](https://github.com/cfoster5/lookforward/commit/5956c05370fdb9efe11f714e664352c061bf8e95))
* Update app icon and splash screen ([3331462](https://github.com/cfoster5/lookforward/commit/3331462a6b162e4e0220a4fc52385b7327a4eb9c))


### Bug Fixes

* Add aps-environment entitlement for Expo 51 ([47e7c54](https://github.com/cfoster5/lookforward/commit/47e7c54c006871c5c822bc62c3f68c01b5a66789))
* Add optional chaining operator for notification toggles ([840a482](https://github.com/cfoster5/lookforward/commit/840a482975c1ac51ed332e748f08383d96ecb896))
* Allow taps on bottom sheet when keyboard is present ([e636636](https://github.com/cfoster5/lookforward/commit/e636636d250dca50348d9d38eda6886f7632d6b7))
* Android build issue ([afb7415](https://github.com/cfoster5/lookforward/commit/afb7415998efad647f6aedea786cc23a46900e22))
* Bump RN header buttons; ([d95d7b4](https://github.com/cfoster5/lookforward/commit/d95d7b4b5691d8620fa1e48d23b2a5d198df66de))
* Close keyboard on modal present ([d936614](https://github.com/cfoster5/lookforward/commit/d936614e58bbdf7f2b26513c3edebac484ae6993))
* Conditionally open release modal for GameDiscover ([b41c0d0](https://github.com/cfoster5/lookforward/commit/b41c0d09807c82d8f85600cca24ec553e10cfa74))
* Correct usage of path parameter ([ef74b2b](https://github.com/cfoster5/lookforward/commit/ef74b2be25413c00fa3b845cdabe73882fd20ac8))
* Fix inconsistent sizes for game posters; closes [#16](https://github.com/cfoster5/lookforward/issues/16) ([8f35902](https://github.com/cfoster5/lookforward/commit/8f35902ad7dcdecb8f3eaa9b773de70cbcc98250))
* Force fake view under SearchBottomSheet to bottom ([4ce03fe](https://github.com/cfoster5/lookforward/commit/4ce03fed4263384925c0e8197a71ba080bd564cc))
* Force visibility for BottomSheetBackdrop ([c55601f](https://github.com/cfoster5/lookforward/commit/c55601fe3aede096eda4d95e71a63a323d0002e7))
* Patch react-native-screens to automatically shortening title to "Back" ([c6977d5](https://github.com/cfoster5/lookforward/commit/c6977d54496b17b56c8ece2243745f53ed51e792))
* Remove blurred tabs for Search screen; close [#4](https://github.com/cfoster5/lookforward/issues/4) ([d38eeea](https://github.com/cfoster5/lookforward/commit/d38eeeacd54e3f81cd4e091af7fd16dab3a52fcb))
* Remove export for deleted interface ([7f08e84](https://github.com/cfoster5/lookforward/commit/7f08e844b13a591fafbb3836b51d80c7b2b08506))
* Remove non-null assertion operator for ratings ([04b3421](https://github.com/cfoster5/lookforward/commit/04b34212d01e05085f2a6d53a267e3a11a75a9fe))
* Render game release date conditionally ([66d8c80](https://github.com/cfoster5/lookforward/commit/66d8c806d2a9523f4397755d720af326a1c0ab3b))
* Replace HBO Max with Max as a targeted provider ([f4250b6](https://github.com/cfoster5/lookforward/commit/f4250b6e94c43c21e7304e1eab258a004555ebbb))
* Set color to adaptable PlatformColor ([d89924b](https://github.com/cfoster5/lookforward/commit/d89924bf2af8355e3d66d5240ffa24ece376aba9))
* Set game in store to null to close platform picker ([00b7a6c](https://github.com/cfoster5/lookforward/commit/00b7a6ce91f92cc58f14c2a858745c4daed9bb9f))
* Set initial snapPoint to tabBarHeight ([b45d3e5](https://github.com/cfoster5/lookforward/commit/b45d3e55035ffb360528b8de323d8d6c856f47f7))
* Set subs directly on Countdown selection; close [#9](https://github.com/cfoster5/lookforward/issues/9) ([c6ed4bb](https://github.com/cfoster5/lookforward/commit/c6ed4bb6b93c53325639f4ae0aa31cdd154608e1))
* Update borderRadius to 12; fixes [#5](https://github.com/cfoster5/lookforward/issues/5) ([bcafc28](https://github.com/cfoster5/lookforward/commit/bcafc28156f251ad129fbe88262621b634993622))
* Update color for label ([a4de40f](https://github.com/cfoster5/lookforward/commit/a4de40fea860f2710e44c098a29077c88a0d7a6e))
* Update name used on os home screen ([8adff30](https://github.com/cfoster5/lookforward/commit/8adff300f4fce1d42babd0d69e337554b694257a))
* Update prop name used in GamePoster ([b54eb3c](https://github.com/cfoster5/lookforward/commit/b54eb3c5ed7d138e34b9584af1b0710cbfa55ec6))
* Update splash screen to hide white top and bottom ([0e22ac9](https://github.com/cfoster5/lookforward/commit/0e22ac9aa002078226dc10796666d83684a01984))
* Use FlatList from RN gesture handler ([2cffe6d](https://github.com/cfoster5/lookforward/commit/2cffe6d3d85d8ade9b41fde1f6b76dbef5a27682))
* Wrap BottomSheet content with flex so search results take full height ([275a030](https://github.com/cfoster5/lookforward/commit/275a03059190a67abd70be7f7cbd343b29bbba5d))

## 6.2.6 (2024-09-16)
