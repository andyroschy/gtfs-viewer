export function toPascalCase(value: string) {
    return value.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
