{pkgs ? import <nixpkgs> {}}:
with pkgs;
stdenv.mkDerivation {
	name = "throwy";
	src = null; # TODO
	buildInputs = [ gup nodePackages.typescript ];
}
