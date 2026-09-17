#!/usr/bin/env bash

set -euo pipefail

template_source="gh:Dingola/ReactWebTemplate"
project_name="$(basename "$PWD")"
vcs_ref=""

usage() {
  cat <<'EOF'
Usage: ./initialize.sh [--template-source SOURCE] [--project-name NAME] [--vcs-ref REF]
EOF
}

while (($#)); do
  case "$1" in
    --template-source)
      template_source="${2:?Missing value for --template-source}"
      shift 2
      ;;
    --project-name)
      project_name="${2:?Missing value for --project-name}"
      shift 2
      ;;
    --vcs-ref)
      vcs_ref="${2:?Missing value for --vcs-ref}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

for command_name in git copier; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Required command '$command_name' was not found in PATH." >&2
    exit 1
  fi
done

if [[ ! -d .git ]]; then
  echo "Run this script from the root of a repository created from ReactWebTemplate." >&2
  exit 1
fi

if [[ ! -f copier.yml || ! -d template ]]; then
  echo "The Copier bootstrap files are missing or this project is already initialized." >&2
  exit 1
fi

if [[ -f .copier-answers.yml ]]; then
  echo "This project is already initialized. Use 'copier update' instead." >&2
  exit 1
fi

if [[ ! "$project_name" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
  echo "Project name may contain letters, numbers, dots, underscores, and hyphens." >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "The Git working tree must be clean before initialization." >&2
  exit 1
fi

package_name="$(printf '%s' "$project_name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^[-._]+//; s/[-._]+$//')"
if [[ -z "$package_name" ]]; then
  echo "The project name cannot be converted to a valid npm package name." >&2
  exit 1
fi

copy_arguments=(
  copy
  --overwrite
  --data "project_name=$project_name"
  --data "package_name=$package_name"
)
if [[ -n "$vcs_ref" ]]; then
  copy_arguments+=(--vcs-ref "$vcs_ref")
fi
copy_arguments+=("$template_source" .)

echo "Generating project '$project_name' from '$template_source'..."
copier "${copy_arguments[@]}"

if [[ ! -f .copier-answers.yml ]]; then
  echo "Copier completed without creating .copier-answers.yml." >&2
  exit 1
fi

repository_path="$(pwd -P)"
template_path="$(cd template && pwd -P)"
case "$template_path" in
  "$repository_path"/*) ;;
  *)
    echo "Refusing to remove a template directory outside the repository." >&2
    exit 1
    ;;
esac

rm -rf -- "$template_path"
rm -f -- copier.yml .github/workflows/validate_template.yml initialize.cmd initialize.ps1 initialize.sh

echo
echo "Project generation completed successfully."
echo "Install dependencies, run the quality gate, and commit the generated lock file."
echo "Future template updates can be applied from a clean working tree with 'copier update'."
