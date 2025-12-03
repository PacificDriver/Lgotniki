"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.LoadMode = exports.CardType = exports.BenefitCalculationType = exports.OperationType = exports.BeneficiaryStatus = void 0;
var BeneficiaryStatus;
(function (BeneficiaryStatus) {
    BeneficiaryStatus["ACTIVE"] = "active";
    BeneficiaryStatus["INACTIVE"] = "inactive";
    BeneficiaryStatus["ARCHIVE"] = "archive";
    BeneficiaryStatus["UNDER_REVIEW"] = "under_review";
    BeneficiaryStatus["POSSIBLY_LOST"] = "possibly_lost";
})(BeneficiaryStatus || (exports.BeneficiaryStatus = BeneficiaryStatus = {}));
var OperationType;
(function (OperationType) {
    OperationType["CREATED"] = "created";
    OperationType["UPDATED"] = "updated";
    OperationType["DELETED"] = "deleted";
    OperationType["LOADED"] = "loaded";
    OperationType["BENEFIT_ASSIGNED"] = "benefit_assigned";
    OperationType["BENEFIT_USED"] = "benefit_used";
    OperationType["CARD_LINKED"] = "card_linked";
    OperationType["CARD_UNLINKED"] = "card_unlinked";
    OperationType["STATUS_CHANGED"] = "status_changed";
})(OperationType || (exports.OperationType = OperationType = {}));
var BenefitCalculationType;
(function (BenefitCalculationType) {
    BenefitCalculationType["FIXED_TRIPS"] = "fixed_trips";
    BenefitCalculationType["KILOMETER_LIMIT"] = "kilometer_limit";
    BenefitCalculationType["DISCOUNT_PERCENT"] = "discount_percent";
    BenefitCalculationType["FREE"] = "free";
})(BenefitCalculationType || (exports.BenefitCalculationType = BenefitCalculationType = {}));
var CardType;
(function (CardType) {
    CardType["RFID"] = "rfid";
    CardType["NFC"] = "nfc";
    CardType["HASH_PAN"] = "hash_pan";
})(CardType || (exports.CardType = CardType = {}));
var LoadMode;
(function (LoadMode) {
    LoadMode["FULL_SYNC"] = "full_sync";
    LoadMode["SOFT_ADD"] = "soft_add";
    LoadMode["ONLY_NEW"] = "only_new";
    LoadMode["ONLY_UPDATE"] = "only_update";
    LoadMode["FULL_RELOAD"] = "full_reload";
    LoadMode["WITH_ARCHIVE"] = "with_archive";
    LoadMode["WITH_MANUAL_REVIEW"] = "with_manual_review";
    LoadMode["WITH_DELAYED_DEACTIVATION"] = "with_delayed_deactivation";
    LoadMode["BY_LOAD_COUNTER"] = "by_load_counter";
})(LoadMode || (exports.LoadMode = LoadMode = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
//# sourceMappingURL=index.js.map