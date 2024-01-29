{ lib, callPackage, stdenv, nodePackages, yarn-berry, gup, glib, enableTests ? false }:
let
	sources = callPackage ./sources.nix {};
	fetlock = callPackage (sources.fetlock) {};
	selection = fetlock.yarn.load ./lock.nix {
		src = sources.local { url = ../.; };
		pkgOverrides = self: [
			(self.overrideAttrs {
				slinger = (o: {
					buildInputs = o.buildInputs ++ [ gup glib nodePackages.typescript ];
					buildPhase = o.buildPhase + ''
						gup compile
					'';
					installPhase = ''
						dest=$out/share/gnome-shell/extensions
						mkdir -p $dest
						cp -r --dereference extension $dest/slinger@gfxmonk.net
					'';
				});
			})
		];
	};
in
	selection.root
