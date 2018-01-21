{stdenv, nodePackages, gup, glib}:
stdenv.mkDerivation {
	name = "slinger";
	src = null; # TODO
	buildInputs = [ gup nodePackages.typescript glib ];
	buildPhase = ''
		gup compile
	'';
	installPhase = ''
		dest=$out/share/gnome-shell/extensions
		mkdir -p $dest
		cp -r --dereference extension $dest/slinger@gfxmonk.net
	'';
}
