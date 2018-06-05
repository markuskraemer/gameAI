import { ConfigService } from './config.service';
import { KeyboardService } from './game/Keyboard.service';
import { GameService } from './game/game.service';
import { MapService } from './game/map.service';

export class Alias {
    public static gameService:GameService;
    public static mapService:MapService;
    public static keyboardService:KeyboardService;
    public static configService:ConfigService;
}
