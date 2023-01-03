"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchase = exports.products = exports.users = void 0;
exports.users = [
    {
        id: "u1",
        email: "u1@guser.com",
        password: "1u"
    },
    {
        id: "u2",
        email: "u2@guser.com",
        password: "2u"
    }
];
exports.products = [
    {
        id: "p1",
        name: "produto1",
        price: 1,
        category: "p",
    },
    {
        id: "p2",
        name: "produto2",
        price: 2,
        category: "p",
    }
];
exports.purchase = [
    {
        userId: "u1",
        productId: "p1",
        quantity: 1,
        totalPrice: 1
    },
    {
        userId: "u2",
        productId: "p2",
        quantity: 1,
        totalPrice: 2
    }
];
//# sourceMappingURL=database.js.map