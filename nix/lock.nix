final:
let
  pkgs = final.pkgs;
in
{
  context = {
    type = "yarn";
    version = "1";
    root = "slinger@.";
  };
  specs = {
    "@esbuild/aix-ppc64@0.19.11" = {
      pname = "esbuild-aix-ppc64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-FnzU0LyE3ySQk7UntJO4+qIiQgI7KoODnZg5xzXIrFJlKd2P2gwHsHY4927xj9y5PJmJSzULiUCWmv7iWnNa7g==";
        url = "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.19.11.tgz";
      });
      pkgname = "@esbuild/aix-ppc64";
    };
    "@esbuild/android-arm64@0.19.11" = {
      pname = "esbuild-android-arm64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-aiu7K/5JnLj//KOnOfEZ0D90obUkRzDMyqd/wNAUQ34m4YUPVhRZpnqKV9uqDGxT7cToSDnIHsGooyIczu9T+Q==";
        url = "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.19.11.tgz";
      });
      pkgname = "@esbuild/android-arm64";
    };
    "@esbuild/android-arm@0.19.11" = {
      pname = "esbuild-android-arm";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-5OVapq0ClabvKvQ58Bws8+wkLCV+Rxg7tUVbo9xu034Nm536QTII4YzhaFriQ7rMrorfnFKUsArD2lqKbFY4vw==";
        url = "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.19.11.tgz";
      });
      pkgname = "@esbuild/android-arm";
    };
    "@esbuild/android-x64@0.19.11" = {
      pname = "esbuild-android-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-eccxjlfGw43WYoY9QgB82SgGgDbibcqyDTlk3l3C0jOVHKxrjdc9CTwDUQd0vkvYg5um0OH+GpxYvp39r+IPOg==";
        url = "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/android-x64";
    };
    "@esbuild/darwin-arm64@0.19.11" = {
      pname = "esbuild-darwin-arm64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-ETp87DRWuSt9KdDVkqSoKoLFHYTrkyz2+65fj9nfXsaV3bMhTCjtQfw3y+um88vGRKRiF7erPrh/ZuIdLUIVxQ==";
        url = "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.19.11.tgz";
      });
      pkgname = "@esbuild/darwin-arm64";
    };
    "@esbuild/darwin-x64@0.19.11" = {
      pname = "esbuild-darwin-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-fkFUiS6IUK9WYUO/+22omwetaSNl5/A8giXvQlcinLIjVkxwTLSktbF5f/kJMftM2MJp9+fXqZ5ezS7+SALp4g==";
        url = "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/darwin-x64";
    };
    "@esbuild/freebsd-arm64@0.19.11" = {
      pname = "esbuild-freebsd-arm64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-lhoSp5K6bxKRNdXUtHoNc5HhbXVCS8V0iZmDvyWvYq9S5WSfTIHU2UGjcGt7UeS6iEYp9eeymIl5mJBn0yiuxA==";
        url = "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.19.11.tgz";
      });
      pkgname = "@esbuild/freebsd-arm64";
    };
    "@esbuild/freebsd-x64@0.19.11" = {
      pname = "esbuild-freebsd-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-JkUqn44AffGXitVI6/AbQdoYAq0TEullFdqcMY/PCUZ36xJ9ZJRtQabzMA+Vi7r78+25ZIBosLTOKnUXBSi1Kw==";
        url = "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/freebsd-x64";
    };
    "@esbuild/linux-arm64@0.19.11" = {
      pname = "esbuild-linux-arm64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-LneLg3ypEeveBSMuoa0kwMpCGmpu8XQUh+mL8XXwoYZ6Be2qBnVtcDI5azSvh7vioMDhoJFZzp9GWp9IWpYoUg==";
        url = "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-arm64";
    };
    "@esbuild/linux-arm@0.19.11" = {
      pname = "esbuild-linux-arm";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-3CRkr9+vCV2XJbjwgzjPtO8T0SZUmRZla+UL1jw+XqHZPkPgZiyWvbDvl9rqAN8Zl7qJF0O/9ycMtjU67HN9/Q==";
        url = "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-arm";
    };
    "@esbuild/linux-ia32@0.19.11" = {
      pname = "esbuild-linux-ia32";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-caHy++CsD8Bgq2V5CodbJjFPEiDPq8JJmBdeyZ8GWVQMjRD0sU548nNdwPNvKjVpamYYVL40AORekgfIubwHoA==";
        url = "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-ia32";
    };
    "@esbuild/linux-loong64@0.19.11" = {
      pname = "esbuild-linux-loong64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-ppZSSLVpPrwHccvC6nQVZaSHlFsvCQyjnvirnVjbKSHuE5N24Yl8F3UwYUUR1UEPaFObGD2tSvVKbvR+uT1Nrg==";
        url = "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-loong64";
    };
    "@esbuild/linux-mips64el@0.19.11" = {
      pname = "esbuild-linux-mips64el";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-B5x9j0OgjG+v1dF2DkH34lr+7Gmv0kzX6/V0afF41FkPMMqaQ77pH7CrhWeR22aEeHKaeZVtZ6yFwlxOKPVFyg==";
        url = "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-mips64el";
    };
    "@esbuild/linux-ppc64@0.19.11" = {
      pname = "esbuild-linux-ppc64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-MHrZYLeCG8vXblMetWyttkdVRjQlQUb/oMgBNurVEnhj4YWOr4G5lmBfZjHYQHHN0g6yDmCAQRR8MUHldvvRDA==";
        url = "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-ppc64";
    };
    "@esbuild/linux-riscv64@0.19.11" = {
      pname = "esbuild-linux-riscv64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-f3DY++t94uVg141dozDu4CCUkYW+09rWtaWfnb3bqe4w5NqmZd6nPVBm+qbz7WaHZCoqXqHz5p6CM6qv3qnSSQ==";
        url = "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-riscv64";
    };
    "@esbuild/linux-s390x@0.19.11" = {
      pname = "esbuild-linux-s390x";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-A5xdUoyWJHMMlcSMcPGVLzYzpcY8QP1RtYzX5/bS4dvjBGVxdhuiYyFwp7z74ocV7WDc0n1harxmpq2ePOjI0Q==";
        url = "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-s390x";
    };
    "@esbuild/linux-x64@0.19.11" = {
      pname = "esbuild-linux-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-grbyMlVCvJSfxFQUndw5mCtWs5LO1gUlwP4CDi4iJBbVpZcqLVT29FxgGuBJGSzyOxotFG4LoO5X+M1350zmPA==";
        url = "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/linux-x64";
    };
    "@esbuild/netbsd-x64@0.19.11" = {
      pname = "esbuild-netbsd-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-13jvrQZJc3P230OhU8xgwUnDeuC/9egsjTkXN49b3GcS5BKvJqZn86aGM8W9pd14Kd+u7HuFBMVtrNGhh6fHEQ==";
        url = "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/netbsd-x64";
    };
    "@esbuild/openbsd-x64@0.19.11" = {
      pname = "esbuild-openbsd-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-ysyOGZuTp6SNKPE11INDUeFVVQFrhcNDVUgSQVDzqsqX38DjhPEPATpid04LCoUr2WXhQTEZ8ct/EgJCUDpyNw==";
        url = "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/openbsd-x64";
    };
    "@esbuild/sunos-x64@0.19.11" = {
      pname = "esbuild-sunos-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-Hf+Sad9nVwvtxy4DXCZQqLpgmRTQqyFyhT3bZ4F2XlJCjxGmRFF0Shwn9rzhOYRB61w9VMXUkxlBy56dk9JJiQ==";
        url = "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/sunos-x64";
    };
    "@esbuild/win32-arm64@0.19.11" = {
      pname = "esbuild-win32-arm64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-0P58Sbi0LctOMOQbpEOvOL44Ne0sqbS0XWHMvvrg6NE5jQ1xguCSSw9jQeUk2lfrXYsKDdOe6K+oZiwKPilYPQ==";
        url = "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.19.11.tgz";
      });
      pkgname = "@esbuild/win32-arm64";
    };
    "@esbuild/win32-ia32@0.19.11" = {
      pname = "esbuild-win32-ia32";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-6YOrWS+sDJDmshdBIQU+Uoyh7pQKrdykdefC1avn76ss5c+RN6gut3LZA4E2cH5xUEp5/cA0+YxRaVtRAb0xBg==";
        url = "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.19.11.tgz";
      });
      pkgname = "@esbuild/win32-ia32";
    };
    "@esbuild/win32-x64@0.19.11" = {
      pname = "esbuild-win32-x64";
      version = "0.19.11";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-vfkhltrjCAb603XaFhqhAF4LGDi2M4OrCRrFusyQ+iTLQ/o60QQXxc9cZC/FFpihBI9N1Grn6SMKVJ4KP7Fuiw==";
        url = "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.19.11.tgz";
      });
      pkgname = "@esbuild/win32-x64";
    };
    "@girs/accountsservice-1.0@1.0.0-3.2.7" = {
      pname = "girs-accountsservice-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-KRdQ6sf/XvuAxu6+1fXR8gslOMsPrM/01Qtxz8eJt6B/XJr7iK8C22WBJMcG00LD5svoRsaObD13Bd3wvV4ddw==";
        url = "https://registry.npmjs.org/@girs/accountsservice-1.0/-/accountsservice-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/accountsservice-1.0";
    };
    "@girs/adw-1@1.4.2-3.2.7" = {
      pname = "girs-adw-1";
      version = "1.4.2-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdk-4.0@4.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/gsk-4.0@4.0.0-3.2.7")
        ("@girs/gtk-4.0@4.12.4-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-ULD9Z8U6DFdrN5oD8kfu5Q2OEh6HzK2fQu0ujr8FHn7WSlq+/BMV48xUOE26JnFyIZQumiP/RKXl6flMWCIY4Q==";
        url = "https://registry.npmjs.org/@girs/adw-1/-/adw-1-1.4.2-3.2.7.tgz";
      });
      pkgname = "@girs/adw-1";
    };
    "@girs/atk-1.0@2.50.0-3.2.7" = {
      pname = "girs-atk-1.0";
      version = "2.50.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-4HBiLdINigopQksxhZCToRHPh2oUjL32ogZ/JzHqrxB+SMF3wSNS2nuyRI/RRhx0wDIrq+8H9PgQ1gzsbhxdWg==";
        url = "https://registry.npmjs.org/@girs/atk-1.0/-/atk-1.0-2.50.0-3.2.7.tgz";
      });
      pkgname = "@girs/atk-1.0";
    };
    "@girs/cairo-1.0@1.0.0-3.2.7" = {
      pname = "girs-cairo-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-WeAyTY8tUoVe8W1IDbxOYDczWyUotg/7sjzWPv5TXQJJAe3vZ6TfkYPSIlnQHkQ43XfWhSa0JA2s5Oitttdu0g==";
        url = "https://registry.npmjs.org/@girs/cairo-1.0/-/cairo-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/cairo-1.0";
    };
    "@girs/cally-13@13.0.0-3.2.7" = {
      pname = "girs-cally-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/atk-1.0@2.50.0-3.2.7")
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/clutter-13@13.0.0-3.2.7")
        ("@girs/cogl-13@13.0.0-3.2.7")
        ("@girs/coglpango-13@13.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/json-1.0@1.7.1-3.2.7")
        ("@girs/mtk-13@13.0.0-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-EAWBXhAyl1+W18mvPd0/awEWV7SqCyhrr6a5JLMxpfPv6JSokAiJcoEhRlR35bkh5HVxSHHWfchn7UKSKtnjeQ==";
        url = "https://registry.npmjs.org/@girs/cally-13/-/cally-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/cally-13";
    };
    "@girs/clutter-13@13.0.0-3.2.7" = {
      pname = "girs-clutter-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/atk-1.0@2.50.0-3.2.7")
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/cogl-13@13.0.0-3.2.7")
        ("@girs/coglpango-13@13.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/json-1.0@1.7.1-3.2.7")
        ("@girs/mtk-13@13.0.0-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-2fu3+wfZu6E3jBpavdYtX0Zm1SeaI24gjAzPNRlw+MTY0KpJ0ZevSavQ2IbKlLai/wo1YMCUrHmkjhmS6kIDdw==";
        url = "https://registry.npmjs.org/@girs/clutter-13/-/clutter-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/clutter-13";
    };
    "@girs/cogl-13@13.0.0-3.2.7" = {
      pname = "girs-cogl-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-oVIqRXYwf0tER8n/Sq0SyRzZm5svCN8/ZDZig33+j3YpW2T2S4zzC2Px2ZlYVExolawh9P6NXUWnRhnPIGyp+Q==";
        url = "https://registry.npmjs.org/@girs/cogl-13/-/cogl-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/cogl-13";
    };
    "@girs/cogl-2.0@2.0.0-3.2.7" = {
      pname = "girs-cogl-2.0";
      version = "2.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-YyAcGlkvsfUIpns/NfEw1VDWh7WUxysoeHO36Rn4LZCUK2gpq7VabwQIGNRemVyYG/l4x7SaEoIr9pFRuyHHRQ==";
        url = "https://registry.npmjs.org/@girs/cogl-2.0/-/cogl-2.0-2.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/cogl-2.0";
    };
    "@girs/coglpango-13@13.0.0-3.2.7" = {
      pname = "girs-coglpango-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/cogl-13@13.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-iiQFWtVYOyyiTiCjBT/g9K0H7cvxG56mEnz+wtrHVYDSrkI029xv+7b+FjOrrzlkoyRr8CfWnTAYHhpmhvatdg==";
        url = "https://registry.npmjs.org/@girs/coglpango-13/-/coglpango-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/coglpango-13";
    };
    "@girs/freetype2-2.0@2.0.0-3.2.7" = {
      pname = "girs-freetype2-2.0";
      version = "2.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-oapcm7uCVWyL9N7VHuBOxbCWTa9QoF1EX6DFAwpGK4gwVrkjedZ4kZuxtza1gsZrkmYlWNK66H7YShFHgUWdPw==";
        url = "https://registry.npmjs.org/@girs/freetype2-2.0/-/freetype2-2.0-2.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/freetype2-2.0";
    };
    "@girs/gck-2@4.1.0-3.2.7" = {
      pname = "girs-gck-2";
      version = "4.1.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-6eOLKMxM3ZCWLDwXdT9a6THQZfCPvIXcsvtQDoYlef9Ud+8owU/JhyXuQWysGqbbCv01mbvLe58uQ+KChRNkcg==";
        url = "https://registry.npmjs.org/@girs/gck-2/-/gck-2-4.1.0-3.2.7.tgz";
      });
      pkgname = "@girs/gck-2";
    };
    "@girs/gcr-4@4.1.0-3.2.7" = {
      pname = "girs-gcr-4";
      version = "4.1.0-3.2.7";
      depKeys = [
        ("@girs/gck-2@4.1.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-B8zFgzzHgLfcH1JoZqWLEwKExR2hgSDV72sxvvJoiB+ka3VWOs76/+0KODvd+BRMuZvA7t+zkKdGJ1VKtFoRwA==";
        url = "https://registry.npmjs.org/@girs/gcr-4/-/gcr-4-4.1.0-3.2.7.tgz";
      });
      pkgname = "@girs/gcr-4";
    };
    "@girs/gdesktopenums-3.0@3.0.0-3.2.7" = {
      pname = "girs-gdesktopenums-3.0";
      version = "3.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-4MC7jc7CM9pyylzTcoxjWuDJt9Q4FQ2h5WospM2yyrE2GjdNESw5HRdT98Nt3vly2W5akPDudNGSqb3YCqhcPg==";
        url = "https://registry.npmjs.org/@girs/gdesktopenums-3.0/-/gdesktopenums-3.0-3.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gdesktopenums-3.0";
    };
    "@girs/gdk-4.0@4.0.0-3.2.7" = {
      pname = "girs-gdk-4.0";
      version = "4.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-NULHNgwiLjX3vEWDhxSwEmVrSDv2UZaozZcTg295sRdQ/SrpnT5fYT9iL/HnB7JE2H2SBdYnhUrK3SnvCOCb9g==";
        url = "https://registry.npmjs.org/@girs/gdk-4.0/-/gdk-4.0-4.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gdk-4.0";
    };
    "@girs/gdkpixbuf-2.0@2.0.0-3.2.7" = {
      pname = "girs-gdkpixbuf-2.0";
      version = "2.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-/POHLvRlJ6QYO8Wkrj2PDQT2lYh1vJFOHcfWd/yhtr7P3WWKGqOEG5NJAg81bMG8UIZOrc00HALXfCgbAalKGg==";
        url = "https://registry.npmjs.org/@girs/gdkpixbuf-2.0/-/gdkpixbuf-2.0-2.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gdkpixbuf-2.0";
    };
    "@girs/gdm-1.0@1.0.0-3.2.7" = {
      pname = "girs-gdm-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-U05ZfhCxfiUSj48z28g/wokHKB/+BoPfSSIUdmh3OjcX1ssw9hbr+W/C2aPK6TC/iQQT/XQbntbTwkIxqfLPsw==";
        url = "https://registry.npmjs.org/@girs/gdm-1.0/-/gdm-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gdm-1.0";
    };
    "@girs/gio-2.0@2.78.0-3.2.7" = {
      pname = "girs-gio-2.0";
      version = "2.78.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-88GNniBwxAsXrfA+T1wNUxoQk8HivDZUVq1KF3ZsomrQyRDcwCgQLcLyC6c5ZAkg6xwnHZmTIWoYgITiee/lLA==";
        url = "https://registry.npmjs.org/@girs/gio-2.0/-/gio-2.0-2.78.0-3.2.7.tgz";
      });
      pkgname = "@girs/gio-2.0";
    };
    "@girs/gjs@3.2.7" = {
      pname = "girs-gjs";
      version = "3.2.7";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-gaZLkffVm2e5zvyyGNcDgFgyL5WaHZWUr0XBLtuKEM17/qA4udZQRif7HkW//PG8T2AQpuOfSdRj7uJrItykNw==";
        url = "https://registry.npmjs.org/@girs/gjs/-/gjs-3.2.7.tgz";
      });
      cyclicDepKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      pkgname = "@girs/gjs";
    };
    "@girs/gl-1.0@1.0.0-3.2.7" = {
      pname = "girs-gl-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-pYGo7+u0KCUG63am/zmwOAUosurCs/BxwVRsOAnOKnZppkjfTqssEdAz1YyetbPK/n8sbYjsSWae/yIJmYAgRw==";
        url = "https://registry.npmjs.org/@girs/gl-1.0/-/gl-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gl-1.0";
    };
    "@girs/glib-2.0@2.78.0-3.2.7" = {
      pname = "girs-glib-2.0";
      version = "2.78.0-3.2.7";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-h1zGUd58VnQn93Xws91E0mwio8weBWdqDn6sm5Q0xzPmhGGH8+9h/z9JGc7YKj32PnlWrPJ8r9lxeyvO57zT6A==";
        url = "https://registry.npmjs.org/@girs/glib-2.0/-/glib-2.0-2.78.0-3.2.7.tgz";
      });
      cyclicDepKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      pkgname = "@girs/glib-2.0";
    };
    "@girs/gmodule-2.0@2.0.0-3.2.7" = {
      pname = "girs-gmodule-2.0";
      version = "2.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-7B+rAZ6grSYwSOz2p4h8hSKoK5QIuSVHEM7qGUTC6qpPiLvREcaBNGJSGgAMgxtRhyXPYVsUyLhMgUokrFUC+g==";
        url = "https://registry.npmjs.org/@girs/gmodule-2.0/-/gmodule-2.0-2.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gmodule-2.0";
    };
    "@girs/gnome-shell@45.0.0-beta8" = {
      pname = "girs-gnome-shell";
      version = "45.0.0-beta8";
      depKeys = [
        ("@girs/accountsservice-1.0@1.0.0-3.2.7")
        ("@girs/adw-1@1.4.2-3.2.7")
        ("@girs/atk-1.0@2.50.0-3.2.7")
        ("@girs/cally-13@13.0.0-3.2.7")
        ("@girs/clutter-13@13.0.0-3.2.7")
        ("@girs/cogl-2.0@2.0.0-3.2.7")
        ("@girs/gcr-4@4.1.0-3.2.7")
        ("@girs/gdm-1.0@1.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gnomebg-4.0@4.0.0-3.2.7")
        ("@girs/gnomebluetooth-3.0@3.0.0-3.2.7")
        ("@girs/gnomedesktop-4.0@4.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/gtk-4.0@4.12.4-3.2.7")
        ("@girs/gvc-1.0@1.0.0-3.2.7")
        ("@girs/meta-13@13.0.0-3.2.7")
        ("@girs/polkit-1.0@1.0.0-3.2.7")
        ("@girs/shell-13@13.0.0-3.2.7")
        ("@girs/shew-0@0.0.0-3.2.7")
        ("@girs/st-13@13.0.0-3.2.7")
        ("@girs/upowerglib-1.0@0.99.1-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-p7HBvYBHFeuwjnnpth0tBPWg7jLtbmyosfAnfCN7vDav48aaBylVtJSFhlFnEosZXGi9J1i2XT5A1v7bKlboww==";
        url = "https://registry.npmjs.org/@girs/gnome-shell/-/gnome-shell-45.0.0-beta8.tgz";
      });
      pkgname = "@girs/gnome-shell";
    };
    "@girs/gnomebg-4.0@4.0.0-3.2.7" = {
      pname = "girs-gnomebg-4.0";
      version = "4.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdesktopenums-3.0@3.0.0-3.2.7")
        ("@girs/gdk-4.0@4.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gnomedesktop-4.0@4.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-IEognkZ33/XpRmkrfXhV+eda4RnJa9rBcN8ACOHoLsSWQfy5VbRBtSPS12R9Qd5cFe2Qv34GKNk+y8AUU1+fGg==";
        url = "https://registry.npmjs.org/@girs/gnomebg-4.0/-/gnomebg-4.0-4.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gnomebg-4.0";
    };
    "@girs/gnomebluetooth-3.0@3.0.0-3.2.7" = {
      pname = "girs-gnomebluetooth-3.0";
      version = "3.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-Spx/oflIgyioJWu5gZkxcHizFqA5LOI7hWUxPFSB1Pwz6H/+uIwDpMkS9CUbu2RVYV6sasrxcnxtd6XzXP2lWw==";
        url = "https://registry.npmjs.org/@girs/gnomebluetooth-3.0/-/gnomebluetooth-3.0-3.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gnomebluetooth-3.0";
    };
    "@girs/gnomedesktop-4.0@4.0.0-3.2.7" = {
      pname = "girs-gnomedesktop-4.0";
      version = "4.0.0-3.2.7";
      depKeys = [
        ("@girs/gdesktopenums-3.0@3.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-NkfWGGFk3OUgAdaHByfXrtiM23YRUI6ab9JOAcMtgN2CdCNj3jxcQl47IjazvucjQZXA2ZJU+EOCcdxI5aS0Hw==";
        url = "https://registry.npmjs.org/@girs/gnomedesktop-4.0/-/gnomedesktop-4.0-4.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gnomedesktop-4.0";
    };
    "@girs/gobject-2.0@2.78.0-3.2.7" = {
      pname = "girs-gobject-2.0";
      version = "2.78.0-3.2.7";
      depKeys = [
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-BSYxXv4NHZS7ANo0up8N9Dfl3FysIxqsUXmHAMmVkUNdNPfaRyiXnSBiFYzkFdkHQFDoQhM5+RsXz4R94ZLlsw==";
        url = "https://registry.npmjs.org/@girs/gobject-2.0/-/gobject-2.0-2.78.0-3.2.7.tgz";
      });
      cyclicDepKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      pkgname = "@girs/gobject-2.0";
    };
    "@girs/graphene-1.0@1.0.0-3.2.7" = {
      pname = "girs-graphene-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-WVhfoZq2G7mpXSGjI65VzmCLYWIqlFJMHwsgG0nBYZig2zKdle4c4hm5SQu9HrTQWTTPpbt8BM3qPCH2rFISXg==";
        url = "https://registry.npmjs.org/@girs/graphene-1.0/-/graphene-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/graphene-1.0";
    };
    "@girs/gsk-4.0@4.0.0-3.2.7" = {
      pname = "girs-gsk-4.0";
      version = "4.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdk-4.0@4.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-wwEUJVK7RuSqQdinAqry+jVj1JH5s+EAhJ2l+8St8UV6/ajCxz/yUtt/2ACM0bZ9GJhgzM2+C9C3iBw73ZdFHg==";
        url = "https://registry.npmjs.org/@girs/gsk-4.0/-/gsk-4.0-4.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gsk-4.0";
    };
    "@girs/gtk-4.0@4.12.4-3.2.7" = {
      pname = "girs-gtk-4.0";
      version = "4.12.4-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdk-4.0@4.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/gsk-4.0@4.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-av+FCDNb3AgQKJmlj9ZEj4/umOUafrn9WIOYDG9pGrSBdrkHxg7QucFg8ePteMgkLB32yceL3up8hFU0vVUkYQ==";
        url = "https://registry.npmjs.org/@girs/gtk-4.0/-/gtk-4.0-4.12.4-3.2.7.tgz";
      });
      pkgname = "@girs/gtk-4.0";
    };
    "@girs/gvc-1.0@1.0.0-3.2.7" = {
      pname = "girs-gvc-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-5B6YxXRzqo6JbZg4B8KtEOEsUhfEZYo9yESgf95lhWeUXpS6JjJFg/lQ85E/KFDQmKtAJ/UYglmLa8omVvH5DA==";
        url = "https://registry.npmjs.org/@girs/gvc-1.0/-/gvc-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/gvc-1.0";
    };
    "@girs/harfbuzz-0.0@8.2.1-3.2.7" = {
      pname = "girs-harfbuzz-0.0";
      version = "8.2.1-3.2.7";
      depKeys = [
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-2ISw/O1eW90P2jeeFuTZRBE6+z/VWCWCaYZOMTTDaF498PGljKtuexm0e5BEzVrbayU7EgSHhqxfnfpsgI2+eQ==";
        url = "https://registry.npmjs.org/@girs/harfbuzz-0.0/-/harfbuzz-0.0-8.2.1-3.2.7.tgz";
      });
      pkgname = "@girs/harfbuzz-0.0";
    };
    "@girs/json-1.0@1.7.1-3.2.7" = {
      pname = "girs-json-1.0";
      version = "1.7.1-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-MtYgGf3KJCdRoCs5NtxMYlznwvPLqAzjuYApbA02RR9bs/4sr6vfy4FdioZGdLC9krlFiiYoCZJaThglYbEiww==";
        url = "https://registry.npmjs.org/@girs/json-1.0/-/json-1.0-1.7.1-3.2.7.tgz";
      });
      pkgname = "@girs/json-1.0";
    };
    "@girs/meta-13@13.0.0-3.2.7" = {
      pname = "girs-meta-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/atk-1.0@2.50.0-3.2.7")
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/clutter-13@13.0.0-3.2.7")
        ("@girs/cogl-13@13.0.0-3.2.7")
        ("@girs/coglpango-13@13.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdesktopenums-3.0@3.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/json-1.0@1.7.1-3.2.7")
        ("@girs/mtk-13@13.0.0-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
        ("@girs/xfixes-4.0@4.0.0-3.2.7")
        ("@girs/xlib-2.0@2.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-sXvzaAC+9NND/3ma4fMGgrERscbT+j2sGQjsVsLpubzNzWDtOc4AkeV8OD8dopbksnnTS6NA7dbwdpwtDBZ7xA==";
        url = "https://registry.npmjs.org/@girs/meta-13/-/meta-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/meta-13";
    };
    "@girs/mtk-13@13.0.0-3.2.7" = {
      pname = "girs-mtk-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-x6s0192AB90AbG6n26nOMS5q1uxxmeWMyStVUUmcdsd7WLW0IVLAGOaPIyB/KS4W2iBIYLOTIzUBfCT5geAsIA==";
        url = "https://registry.npmjs.org/@girs/mtk-13/-/mtk-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/mtk-13";
    };
    "@girs/nm-1.0@1.45.1-3.2.7" = {
      pname = "girs-nm-1.0";
      version = "1.45.1-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-UCES5B76liszdKvHgFPRSThGHENxBCXb/QurNkJyqPRB6QvIC7NpenRX0oig3S62LbPNFCUNskGMw8Yt3pZwtg==";
        url = "https://registry.npmjs.org/@girs/nm-1.0/-/nm-1.0-1.45.1-3.2.7.tgz";
      });
      pkgname = "@girs/nm-1.0";
    };
    "@girs/pango-1.0@1.51.0-3.2.7" = {
      pname = "girs-pango-1.0";
      version = "1.51.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-wxVVMrZnaWkgBmvTM4rWE20whh0CTRiXINgmK9V2NOdJHUUD3HqIvRxChG6YJmXQcb9h4Gcgpr+OyP34IgP2Sg==";
        url = "https://registry.npmjs.org/@girs/pango-1.0/-/pango-1.0-1.51.0-3.2.7.tgz";
      });
      pkgname = "@girs/pango-1.0";
    };
    "@girs/pangocairo-1.0@1.0.0-3.2.7" = {
      pname = "girs-pangocairo-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-94OAV/UOOO9VZ7d2W9D2SB7FIDfuUHESRGWTq1kq0XGL8o9P8Y4sKB7v2y6CRZTs3IML+IBI1qG9BDIdcNXnUA==";
        url = "https://registry.npmjs.org/@girs/pangocairo-1.0/-/pangocairo-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/pangocairo-1.0";
    };
    "@girs/polkit-1.0@1.0.0-3.2.7" = {
      pname = "girs-polkit-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-C01SGikKSvk6AalMyBaDc33/gvxuiuA9oQYqaf6MEQpOfe466BE5IhZl8L/6VjwVMmAGepFVcjwS5fxaRyioZQ==";
        url = "https://registry.npmjs.org/@girs/polkit-1.0/-/polkit-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/polkit-1.0";
    };
    "@girs/polkitagent-1.0@1.0.0-3.2.7" = {
      pname = "girs-polkitagent-1.0";
      version = "1.0.0-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/polkit-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-YlWtpFISpJR6qZhbL4W59vIFghiQ79EAev+QeqB4K3H9bw1tsoipbFVAqKqxyZFJTDSxSlGOpuVtcJ4EuO77HQ==";
        url = "https://registry.npmjs.org/@girs/polkitagent-1.0/-/polkitagent-1.0-1.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/polkitagent-1.0";
    };
    "@girs/shell-13@13.0.0-3.2.7" = {
      pname = "girs-shell-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/atk-1.0@2.50.0-3.2.7")
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/cally-13@13.0.0-3.2.7")
        ("@girs/clutter-13@13.0.0-3.2.7")
        ("@girs/cogl-13@13.0.0-3.2.7")
        ("@girs/coglpango-13@13.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gck-2@4.1.0-3.2.7")
        ("@girs/gcr-4@4.1.0-3.2.7")
        ("@girs/gdesktopenums-3.0@3.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/gvc-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/json-1.0@1.7.1-3.2.7")
        ("@girs/meta-13@13.0.0-3.2.7")
        ("@girs/mtk-13@13.0.0-3.2.7")
        ("@girs/nm-1.0@1.45.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
        ("@girs/polkit-1.0@1.0.0-3.2.7")
        ("@girs/polkitagent-1.0@1.0.0-3.2.7")
        ("@girs/st-13@13.0.0-3.2.7")
        ("@girs/xfixes-4.0@4.0.0-3.2.7")
        ("@girs/xlib-2.0@2.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-RrjHDZT8lj3uQ6QUg+Pb3AQOPhfJlPbFADZ/wudL1HdLa3GPNrmR1J7pxzXj5VtGWb9DJFjUnqBIyGU2iLkzlA==";
        url = "https://registry.npmjs.org/@girs/shell-13/-/shell-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/shell-13";
    };
    "@girs/shew-0@0.0.0-3.2.7" = {
      pname = "girs-shew-0";
      version = "0.0.0-3.2.7";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdk-4.0@4.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/gsk-4.0@4.0.0-3.2.7")
        ("@girs/gtk-4.0@4.12.4-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-TwFEU3OEPm05MtLmKTTb2Ekb4xp36So+VMYuy59NASCKFbhr+I9wGDU95ZXeztF0+/8wHQpklX0MG3KrVWmzqw==";
        url = "https://registry.npmjs.org/@girs/shew-0/-/shew-0-0.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/shew-0";
    };
    "@girs/st-13@13.0.0-3.2.7" = {
      pname = "girs-st-13";
      version = "13.0.0-3.2.7";
      depKeys = [
        ("@girs/atk-1.0@2.50.0-3.2.7")
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/cally-13@13.0.0-3.2.7")
        ("@girs/clutter-13@13.0.0-3.2.7")
        ("@girs/cogl-13@13.0.0-3.2.7")
        ("@girs/coglpango-13@13.0.0-3.2.7")
        ("@girs/freetype2-2.0@2.0.0-3.2.7")
        ("@girs/gdesktopenums-3.0@3.0.0-3.2.7")
        ("@girs/gdkpixbuf-2.0@2.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/gl-1.0@1.0.0-3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gmodule-2.0@2.0.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/graphene-1.0@1.0.0-3.2.7")
        ("@girs/harfbuzz-0.0@8.2.1-3.2.7")
        ("@girs/json-1.0@1.7.1-3.2.7")
        ("@girs/meta-13@13.0.0-3.2.7")
        ("@girs/mtk-13@13.0.0-3.2.7")
        ("@girs/pango-1.0@1.51.0-3.2.7")
        ("@girs/pangocairo-1.0@1.0.0-3.2.7")
        ("@girs/xfixes-4.0@4.0.0-3.2.7")
        ("@girs/xlib-2.0@2.0.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-v39kFYYY3arbNELzseoRuKkN9hJIJG7ZpFbTGwRuB2pB1sfku3WJpfHPALwPg0uCvpDfSTfxTZ2Fg6R3qFWEdA==";
        url = "https://registry.npmjs.org/@girs/st-13/-/st-13-13.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/st-13";
    };
    "@girs/upowerglib-1.0@0.99.1-3.2.7" = {
      pname = "girs-upowerglib-1.0";
      version = "0.99.1-3.2.7";
      depKeys = [
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-Ss0U2Q6lQ+aLVnddfulAvBJJjwpckV92Z3ivSDZ4VeCqi0dsiInVHlmHUC58Yb/A7EuCplL97hHax4orAgvAFQ==";
        url = "https://registry.npmjs.org/@girs/upowerglib-1.0/-/upowerglib-1.0-0.99.1-3.2.7.tgz";
      });
      pkgname = "@girs/upowerglib-1.0";
    };
    "@girs/xfixes-4.0@4.0.0-3.2.7" = {
      pname = "girs-xfixes-4.0";
      version = "4.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-MpV1+qiNX/8HadIK0Rnh+18S9OBqe2lcILdjVepQGn3lZx0QITPvY1XSdu835jYnTp+/izJWZGqZ9M/ZKI7hCg==";
        url = "https://registry.npmjs.org/@girs/xfixes-4.0/-/xfixes-4.0-4.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/xfixes-4.0";
    };
    "@girs/xlib-2.0@2.0.0-3.2.7" = {
      pname = "girs-xlib-2.0";
      version = "2.0.0-3.2.7";
      depKeys = [
        ("@girs/gjs@3.2.7")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-c4+y9V1BN7u0o2ijVuvT9WzEt7IvSJW/Dt4N7qQdTWfLnsQABPMnLuKQsZ6GRqPWBt+JBH0sOSR0tHBMLATC0g==";
        url = "https://registry.npmjs.org/@girs/xlib-2.0/-/xlib-2.0-2.0.0-3.2.7.tgz";
      });
      pkgname = "@girs/xlib-2.0";
    };
    "esbuild@0.19.11" = {
      pname = "esbuild";
      version = "0.19.11";
      depKeys = [
        ("@esbuild/aix-ppc64@0.19.11")
        ("@esbuild/android-arm@0.19.11")
        ("@esbuild/android-arm64@0.19.11")
        ("@esbuild/android-x64@0.19.11")
        ("@esbuild/darwin-arm64@0.19.11")
        ("@esbuild/darwin-x64@0.19.11")
        ("@esbuild/freebsd-arm64@0.19.11")
        ("@esbuild/freebsd-x64@0.19.11")
        ("@esbuild/linux-arm@0.19.11")
        ("@esbuild/linux-arm64@0.19.11")
        ("@esbuild/linux-ia32@0.19.11")
        ("@esbuild/linux-loong64@0.19.11")
        ("@esbuild/linux-mips64el@0.19.11")
        ("@esbuild/linux-ppc64@0.19.11")
        ("@esbuild/linux-riscv64@0.19.11")
        ("@esbuild/linux-s390x@0.19.11")
        ("@esbuild/linux-x64@0.19.11")
        ("@esbuild/netbsd-x64@0.19.11")
        ("@esbuild/openbsd-x64@0.19.11")
        ("@esbuild/sunos-x64@0.19.11")
        ("@esbuild/win32-arm64@0.19.11")
        ("@esbuild/win32-ia32@0.19.11")
        ("@esbuild/win32-x64@0.19.11")
      ];
      src = (pkgs.fetchurl {
        hash = "sha512-HJ96Hev2hX/6i5cDVwcqiJBBtuo9+FeIJOtZ9W1kA5M6AMJRHUZlpYZ1/SbEwtO0ioNAW8rUooVpC/WehY2SfA==";
        url = "https://registry.npmjs.org/esbuild/-/esbuild-0.19.11.tgz";
      });
      bin = {
        esbuild = "bin/esbuild";
      };
      pkgname = "esbuild";
    };
    "slinger@." = {
      pname = "slinger";
      version = "0.0.0-use.local";
      depKeys = [
        ("@girs/cairo-1.0@1.0.0-3.2.7")
        ("@girs/clutter-13@13.0.0-3.2.7")
        ("@girs/gio-2.0@2.78.0-3.2.7")
        ("@girs/gjs@3.2.7")
        ("@girs/glib-2.0@2.78.0-3.2.7")
        ("@girs/gnome-shell@45.0.0-beta8")
        ("@girs/gobject-2.0@2.78.0-3.2.7")
        ("@girs/meta-13@13.0.0-3.2.7")
        ("@girs/shell-13@13.0.0-3.2.7")
        ("esbuild@0.19.11")
      ];
      src = (final.pathSrc .././.);
      pkgname = "slinger";
    };
  };
}