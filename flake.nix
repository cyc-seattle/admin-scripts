{
  description = "Google Apps Script development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.treefmt-nix.flakeModule
        inputs.pre-commit-hooks.flakeModule
      ];

      systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];

      perSystem = {
        config,
        pkgs,
        ...
      }: {
        treefmt = {
          projectRootFile = "flake.nix";
          programs.prettier.enable = true;
        };

        pre-commit.settings.hooks.treefmt.enable = true;

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20
            config.treefmt.build.wrapper
            just
          ];

          shellHook = ''
            ${config.pre-commit.devShell.shellHook}
            if [ -f package.json ] && [ ! -d node_modules ]; then
              echo "📦 Installing npm dependencies..."
              npm install
              echo ""
            fi

            just --list
          '';
        };
      };
    };
}
