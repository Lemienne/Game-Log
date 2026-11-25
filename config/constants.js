// 여러 모델과 화면에서 함께 쓰는 값 목록 (architecture.md §5)

// 게임 상태
const STATUSES = ["none", "wishlist", "backlog", "playing", "completed", "dropped"];

const STATUS_LABELS = {
  none: "미지정",
  wishlist: "위시리스트",
  backlog: "예정",
  playing: "플레이 중",
  completed: "완료",
  dropped: "중단",
};

// 보유 플랫폼
const PLATFORMS = ["steam", "pc", "switch", "switch2", "ps5", "ps4", "xbox", "mobile", "other"];

const PLATFORM_LABELS = {
  steam: "PC · Steam",
  pc: "PC",
  switch: "Nintendo Switch",
  switch2: "Nintendo Switch 2",
  ps5: "PlayStation 5",
  ps4: "PlayStation 4",
  xbox: "Xbox",
  mobile: "모바일",
  other: "기타",
};

// 보유 정보 출처 (steam이면 동기화가 관리)
const OWNERSHIP_SOURCES = ["steam", "manual"];

// Steam 동기화 결과
const SYNC_STATUSES = ["ok", "private_or_empty", "error"];

// 게임 메타데이터 출처
const METADATA_SOURCES = ["igdb", "steam"];

module.exports = {
  STATUSES,
  STATUS_LABELS,
  PLATFORMS,
  PLATFORM_LABELS,
  OWNERSHIP_SOURCES,
  SYNC_STATUSES,
  METADATA_SOURCES,
};
