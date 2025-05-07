// In a real implementation, this would use a database
const userQuestionCounts: Record<string, number> = {}

export async function getUserQuestionCount(userId: string): Promise<number> {
  return userQuestionCounts[userId] || 0
}

export async function incrementUserQuestionCount(userId: string): Promise<void> {
  userQuestionCounts[userId] = (userQuestionCounts[userId] || 0) + 1
}

export async function resetUserQuestionCount(userId: string): Promise<void> {
  userQuestionCounts[userId] = 0
}
