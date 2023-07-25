def softmax(lst):
  norm = np.exp(lst - np.max(lst))
  return norm / norm.sum()

struct NDArray:
  def max(self) -> NDArray:
    return self.pmap(SIMD.max)

struct SIMD[type: DType, width: Int]:
  def max(self, rhs: Self) -> Self:
    return (self >= rhs).select(self, rhs)