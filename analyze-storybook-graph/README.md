# analyze-storybook-graph

this script is intended to help parse Storybook's `preview-stats.json`, as you might wish to do while [troubleshooting Storybook or Chromatic](https://www.chromatic.com/docs/turbosnap/troubleshooting/#why-are-no-changes-being-detected). my intention was this:

> I am seeing Chromatic skip far fewer Stories than I would expect.
> why is that? let's crawl the dependency graph to figure out which files are triggering all the rebuilds.

of course, this script cannot answer that whole question for me. it can only tell me _which files have the largest blast radius_ of dependents. once I identify these bottleneck files, I need to identify how frequently they change. files with a large blast radius are fine if they change infrequently. it's only files that both have a large blast radius and change frequently that are problems. this can probably be answered by either crawling the Git history, or visually inspecting known problem builds.

## usage

```sh
./analyze_dependencies.py --input preview-stats.json [--output dependency_analysis.json] [--top 20] [--include-node-modules]
```

## compatibility

it is likely that this script is only compatible with Vite builds. I have not tried it on a Webpack build.
