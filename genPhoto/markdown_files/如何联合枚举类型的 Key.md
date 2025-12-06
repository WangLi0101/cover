```typescript
enum str {
  A,
  B,
  C,
}
type strUnion = keyof typeof str; // 'A' | 'B' | 'C'
```
