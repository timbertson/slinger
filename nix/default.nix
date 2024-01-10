{stdenv, nodePackages, gup, glib, enableTests ? false }:
stdenv.mkDerivation {
	name = "slinger";
	src = null; # TODO
	buildInputs = [ gup glib ] ++ (
		with nodePackages;
		[typescript yarn] ++ (if enableTests then [mocha] else [])
	);
	buildPhase = ''
		gup compile
	'';
	installPhase = ''
		dest=$out/share/gnome-shell/extensions
		mkdir -p $dest
		cp -r --dereference extension $dest/slinger@gfxmonk.net
	'';
}
