# Features

This directory is an intentional extension point for cohesive, application-specific
capabilities. Keep this file until the first feature is added so generated applications
use the same name and location consistently.

A larger feature may contain its own `api`, `components`, `hooks`, `model`, and `tests`
directories. Create only the subdirectories required by that feature. Keep generic
visual components in `src/components/ui`, application-wide composition in `src/app`,
and shared infrastructure in `src/lib`.
