{pkgs ? import <nixpkgs> {}}:
with pkgs;
stdenv.mkDerivation {
	name = "slinger";
	src = null; # TODO
	buildInputs = [ gup nodePackages.typescript ];
}
