#!/usr/bin/env -S uv run --script
#
# /// script
# requires-python = ">=3.12"
# ///

"""
analyze-storybook-graph

this script analyzes a preview-stats.json file from a Vite-based Storybook build to calculate
how many files ultimately depend on each component in the dependency tree.

usage: ./analyze_storybook_graph.py --input preview-stats.json [--output dependency_analysis.json] [--top 20] [--include-node-modules]
"""

import json
import sys
from collections import defaultdict, deque
from typing import Dict, Set, List, Tuple


def should_exclude_module(
    module_name: str,
    exclude_node_modules: bool = True,
) -> bool:
    """
    determine if a module should be excluded from analysis.

    args:
        module_name: the name/path of the module
        exclude_node_modules: whether to exclude node_modules dependencies

    returns:
        True if module should be excluded, False otherwise
    """
    if exclude_node_modules and "node_modules" in module_name:
        return True

    return False


def load_dependency_data(filepath: str) -> Dict:
    """
    load the dependency data from the JSON file.

    args:
        filepath: the path to the JSON file

    returns: the dependency data
    """
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"error: file {filepath} not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"error: invalid JSON in {filepath}: {e}")
        sys.exit(1)


def build_dependency_graph(
    data: Dict, exclude_node_modules: bool = True
) -> Tuple[Dict[str, Set[str]], Set[str]]:
    """
    build a dependency graph from the JSON data.

    args:
        data: the loaded JSON data
        exclude_node_modules: whether to exclude node_modules dependencies

    returns:
        - dependents_graph: directed graph of modules and their dependents,
          as a Dict of module names to sets of dependent module names
        - all_modules: Set of all module names in the graph
    """
    dependents_graph = defaultdict(set)
    all_modules = set()
    excluded_count = 0

    for module in data.get("modules", []):
        module_name = module.get("name") or module.get("id")
        if not module_name:
            continue

        # skip excluded modules
        if should_exclude_module(module_name, exclude_node_modules):
            excluded_count += 1
            continue

        all_modules.add(module_name)

        # each `reason` represents a module that depends on this module
        for reason in module.get("reasons", []):
            dependent_name = reason.get("moduleName")
            if dependent_name and not should_exclude_module(
                dependent_name, exclude_node_modules
            ):
                dependents_graph[module_name].add(dependent_name)
                all_modules.add(dependent_name)

    if exclude_node_modules:
        print(f"excluded {excluded_count} node_modules dependencies")

    return dict(dependents_graph), all_modules


def find_all_dependents(module: str, dependents_graph: Dict[str, Set[str]]) -> Set[str]:
    """
    find all modules that transitively depend on the given module using BFS.

    args:
        module: the module to find dependents for
        dependents_graph: directed graph of modules and their dependents,
          as a Dict of module names to sets of dependent module names

    returns:
        Set of all modules that transitively depend on the given module
    """
    all_dependents = set()
    queue = deque([module])
    visited = {module}

    while queue:
        current = queue.popleft()

        # Get direct dependents of current module
        direct_dependents = dependents_graph.get(current, set())

        for dependent in direct_dependents:
            if dependent not in visited:
                visited.add(dependent)
                all_dependents.add(dependent)
                queue.append(dependent)

    return all_dependents


def analyze_dependencies(
    filepath: str = "preview-stats.json", exclude_node_modules: bool = True
) -> List[Tuple[str, int]]:
    """
    analyze the dependency file and return dependency counts for each module.

    args:
        filepath: path to the JSON file
        exclude_node_modules: whether to exclude node_modules dependencies

    returns:
        list of tuples (module_name, dependent_count) sorted by dependent count descending
    """
    print(f"loading dependency data from {filepath}...")
    data = load_dependency_data(filepath)

    print("building dependency graph...")
    dependents_graph, all_modules = build_dependency_graph(data, exclude_node_modules)

    print(f"found {len(all_modules)} total modules")
    print(f"found {len(dependents_graph)} modules with dependents")

    print("calculating transitive dependencies...")
    results = []

    # calculate how many files depend on each module
    for i, module in enumerate(all_modules):
        if i % 1000 == 0:
            print(f"  processed {i}/{len(all_modules)} modules...")

        dependent_count = len(find_all_dependents(module, dependents_graph))
        results.append((module, dependent_count))

    # sort by dependency count (descending)
    results.sort(key=lambda x: x[1], reverse=True)

    return results


def print_results(results: List[Tuple[str, int]], top_n: int = 20):
    """print the analysis results."""
    print(f"\n=== TOP {top_n} MOST DEPENDED-ON MODULES ===")
    print(f"{'rank':<6} {'dependencies':<12} {'module'}")
    print("-" * 80)

    for i, (module, count) in enumerate(results[:top_n], 1):
        # shorten very long module names for display
        display_name = module if len(module) <= 60 else module[:57] + "..."
        print(f"{i:<6} {count:<12} {display_name}")

    print(f"\n=== SUMMARY ===")
    print(f"total modules analyzed: {len(results)}")
    print(f"modules with dependencies: {len([r for r in results if r[1] > 0])}")
    print(f"modules with no dependencies: {len([r for r in results if r[1] == 0])}")


def save_results(
    results: List[Tuple[str, int]],
    output_file: str = "dependency_analysis.json",
    excluded_node_modules: bool = True,
):
    """save the full results to a JSON file."""
    output_data = {
        "summary": {
            "total_modules": len(results),
            "modules_with_dependencies": len([r for r in results if r[1] > 0]),
            "modules_without_dependencies": len([r for r in results if r[1] == 0]),
            "excluded_node_modules": excluded_node_modules,
        },
        "results": [
            {"module": module, "dependent_count": count} for module, count in results
        ],
    }

    with open(output_file, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"full results saved to {output_file}")


def main():
    """main function."""
    import argparse

    parser = argparse.ArgumentParser(description="analyze Storybook dependency graph")
    parser.add_argument(
        "--input",
        "-i",
        default="preview-stats.json",
        help="input JSON file (default: preview-stats.json)",
    )
    parser.add_argument(
        "--output",
        "-o",
        default="dependency_analysis.json",
        help="output JSON file (default: dependency_analysis.json)",
    )
    parser.add_argument(
        "--top",
        "-t",
        type=int,
        default=20,
        help="number of top results to display (default: 20)",
    )
    parser.add_argument(
        "--include-node-modules",
        action="store_true",
        help="include node_modules dependencies in analysis (excluded by default)",
    )

    args = parser.parse_args()

    # analyze dependencies (exclude node_modules by default, unless --include-node-modules is set)
    exclude_node_modules = not args.include_node_modules
    results = analyze_dependencies(args.input, exclude_node_modules)

    # print results
    print_results(results, args.top)

    # save full results
    save_results(results, args.output, exclude_node_modules)


if __name__ == "__main__":
    main()
