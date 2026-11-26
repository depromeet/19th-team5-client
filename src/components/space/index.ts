/**
 * three.js를 쓰는 3D 컴포넌트(space-canvas · stage-model · stage-lighting · character ·
 * player-character · follow-camera)는 여기서 다시 내보내지 않는다. 페이지가 이 파일을 불러올 때
 * three가 메인 번들에 섞이지 않도록, 지연 로드하는 씬 모듈에서만 폴더 경로(@/components/space/character 등)로
 * 가져다 쓴다.
 */
export { InteractionPrompt } from './interaction-prompt';
export { Keycap } from './keycap';
export { SceneBoundary } from './scene-boundary';
export { ScenePlaceholder } from './scene-placeholder';
export { ScreenAnchored, type ScreenInset } from './screen-anchored';
export { SpaceShell } from './space-shell';
