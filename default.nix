{pkgs ? import <nixpkgs> {}}:
with pkgs;
lib.overrideDerivation (callPackage ./nix {}) (o: {
	name = "slinger";
	src = ./nix/local.tgz;
})
