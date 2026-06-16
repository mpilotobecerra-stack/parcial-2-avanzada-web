import { OrderService } from '../services/orderService.js';
const orderService = new OrderService();
export class OrderController {
    create = async (req, res, next) => {
        try {
            const order = await orderService.create(req.user.id, req.body.items ?? []);
            res.status(201).json(order);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const order = await orderService.findById(Number(req.params.id));
            if (!order)
                return res.status(404).json({ message: 'Pedido no encontrado' });
            res.json(order);
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const order = await orderService.updateStatus(Number(req.params.id), req.body.status);
            res.json(order);
        }
        catch (error) {
            next(error);
        }
    };
}
