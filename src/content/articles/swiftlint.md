---
title: "Contributing to SwiftLint: Enforcing Implicit Optional Initialization Style"
short: Enforcing a consistent style for initializing optional variables in SwiftLint
date: 2025-08-13
tags: [Swift, SwiftLint, Code Quality]
---

I recently made a small but neat contribution to [SwiftLint](https://github.com/realm/SwiftLint) that just got merged. The goal was simple: enforce a consistent style for initializing optional variables without unnecessary `= nil`.

## The Problem

Swift optionals are `nil` by default, so writing:

```swift
var title: String? = nil
```

is redundant. While it compiles fine, it’s extra noise in the codebase. I wanted a rule to ensure we follow the cleaner style:

```swift
var title: String?
```

SwiftLint already has a similar [`redundant_optional_initialization`](https://realm.github.io/SwiftLint/redundant_optional_initialization.html) rule, but it’s intended as a correctness rule, not specifically as a style enforcement tool. The idea was to create a configurable rule that lets teams explicitly choose whether to forbid or allow the `= nil` form. This new rule supersedes `redundant_optional_initialization`.

## Implementation

The rule, named `implicit_optional_initialization`, is built using SwiftSyntax and inspects `PatternBindingSyntax` nodes. It detects cases where:

- The type is optional
- There’s an initializer explicitly assigning `nil`
- There are no attached comments or code constructs that require keeping `= nil`

Example violation:
```swift
var title: String? = nil
```

```swift
var count: Int? = nil
```

Valid code:

```swift
var count: Int?
```

It also correctly ignores cases where the `= nil` is part of a more complex declaration or has a specific reason to be explicit.

## Testing

SwiftLint’s example-based testing makes it easy to add sample violations and valid cases:

```swift
// Violation
var username: String? = nil
```

```swift
// No violation
var username: String?
```

From there, the test suite automatically verifies that the rule flags violations and leaves valid cases untouched.

## Lessons Learned

This was my first time working with SwiftLint’s SwiftSyntax-based rules, and I picked up a few things along the way:

- **Pattern matching syntax trees is powerful** – Once you know the exact syntax node you need, implementing a rule becomes straightforward.
- **Testing is built into the workflow** – The example-driven approach makes it easy to define the rule’s intent without writing verbose test code.
- **Small rules can have big impact** – Even a minor style tweak like this improves readability and consistency across a project.

## Outcome

The PR was merged into SwiftLint’s main branch and will be available in an upcoming release. Teams can now opt in to `implicit_optional_initialization` to keep their codebases clean and consistent.