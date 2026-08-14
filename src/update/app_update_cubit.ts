import { Cubit } from './cubit.js';
import { AppUpdateState, AppUpdateStatus } from './types.js';
import { UpdateEnvironment } from './update_environment.js';

export abstract class AppUpdateCubit extends Cubit<AppUpdateStatus> {
  constructor(
    protected upgradeFileName: string,
    protected env: UpdateEnvironment,
    protected log: (logs: string[]) => void
  ) {
    super(new AppUpdateStatus(AppUpdateState.userInput));
  }

  skipUpdate() {
    this.emitState(new AppUpdateStatus(AppUpdateState.skipped));
  }

  abstract tryUpdate(downloadUrl: string): Promise<void>;
}
